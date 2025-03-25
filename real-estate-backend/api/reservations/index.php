<?php
require_once __DIR__ . '/../../utils/ApiResponse.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/Reservation.php';
require_once __DIR__ . '/../../models/Property.php';

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Debug mode
$debugMode = true;

// Parse the URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($uri, '/'));

// Check if URI starts with 'api' and remove it
if (isset($uri[0]) && $uri[0] === 'api') {
    array_shift($uri);
}

// Find reservation ID if present
$id = null;
foreach ($uri as $key => $value) {
    if ($value === 'reservations' && isset($uri[$key + 1]) && is_numeric($uri[$key + 1])) {
        $id = (int) $uri[$key + 1];
        break;
    }
}

// Check for cancel action
$cancel = false;
if ($id) {
    foreach ($uri as $key => $value) {
        if ($value === (string)$id && isset($uri[$key + 1]) && $uri[$key + 1] === 'cancel') {
            $cancel = true;
            break;
        }
    }
}

// Get current user
$currentUser = Auth::getCurrentUser();

// For all except OPTIONS and GET requests, authentication is required
if ($_SERVER['REQUEST_METHOD'] !== 'OPTIONS' && $_SERVER['REQUEST_METHOD'] !== 'GET' && !$currentUser) {
    echo ApiResponse::unauthorized('Authentication required');
    exit;
}

// Initialize models
$reservationModel = new Reservation();
$propertyModel = new Property();

// Handle request based on method and URI
switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        // Get all reservations or a specific one
        if ($id) {
            // Get specific reservation
            try {
                $reservation = $reservationModel->getById($id);
                
                if (!$reservation) {
                    echo ApiResponse::notFound('Reservation not found');
                    exit;
                }
                
                // Check if user owns the reservation or is admin
                if ($currentUser && ($reservation['user_id'] == $currentUser['user_id'] || $currentUser['is_admin'])) {
                    // Get property details
                    $property = $propertyModel->getById($reservation['property_id']);
                    $reservation['property'] = $property;
                    
                    echo ApiResponse::success($reservation);
                } else {
                    echo ApiResponse::unauthorized('You do not have permission to view this reservation');
                }
            } catch (Exception $e) {
                echo ApiResponse::error('Failed to get reservation: ' . $e->getMessage());
            }
        } else {
            // Get all reservations for the current user
            if (!$currentUser) {
                echo ApiResponse::unauthorized('Authentication required');
                exit;
            }
            
            try {
                $reservations = $reservationModel->getAllForUser($currentUser['user_id']);
                
                // Get property details for each reservation
                foreach ($reservations as &$reservation) {
                    $property = $propertyModel->getById($reservation['property_id']);
                    $reservation['property'] = $property;
                }
                
                echo ApiResponse::success($reservations);
            } catch (Exception $e) {
                echo ApiResponse::error('Failed to get reservations: ' . $e->getMessage());
            }
        }
        break;
        
    case 'POST':
        // Create a new reservation or cancel an existing one
        if ($cancel) {
            // Cancel reservation
            try {
                $reservation = $reservationModel->getById($id);
                
                if (!$reservation) {
                    echo ApiResponse::notFound('Reservation not found');
                    exit;
                }
                
                // Check if user owns the reservation or is admin
                if ($reservation['user_id'] != $currentUser['user_id'] && !$currentUser['is_admin']) {
                    echo ApiResponse::unauthorized('You do not have permission to cancel this reservation');
                    exit;
                }
                
                $result = $reservationModel->cancel($id);
                
                if ($result) {
                    echo ApiResponse::success(null, 'Reservation cancelled successfully');
                } else {
                    echo ApiResponse::error('Failed to cancel reservation');
                }
            } catch (Exception $e) {
                echo ApiResponse::error('Failed to cancel reservation: ' . $e->getMessage());
            }
        } else {
            // Create new reservation
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!$data) {
                echo ApiResponse::error('Invalid request data');
                exit;
            }
            
            // Validate required fields
            $requiredFields = ['property_id', 'check_in_date', 'check_out_date'];
            $errors = [];
            
            foreach ($requiredFields as $field) {
                if (empty($data[$field])) {
                    $errors[$field] = "The $field field is required";
                }
            }
            
            if (!empty($errors)) {
                echo ApiResponse::validationError($errors);
                exit;
            }
            
            // Check if the property exists
            $property = $propertyModel->getById($data['property_id']);
            
            if (!$property) {
                echo ApiResponse::notFound('Property not found');
                exit;
            }
            
            // Check if the dates are valid
            $checkInDate = new DateTime($data['check_in_date']);
            $checkOutDate = new DateTime($data['check_out_date']);
            $today = new DateTime();
            
            if ($checkInDate < $today) {
                echo ApiResponse::validationError(['check_in_date' => 'Check-in date must be today or later']);
                exit;
            }
            
            if ($checkOutDate <= $checkInDate) {
                echo ApiResponse::validationError(['check_out_date' => 'Check-out date must be after check-in date']);
                exit;
            }
            
            // Check if the property is available for these dates
            $available = $propertyModel->isAvailable(
                $data['property_id'], 
                $data['check_in_date'], 
                $data['check_out_date']
            );
            
            if (!$available) {
                echo ApiResponse::error('Property is not available for these dates', null, 409);
                exit;
            }
            
            // Calculate total price
            $interval = $checkInDate->diff($checkOutDate);
            $nights = $interval->days;
            $totalPrice = $nights * $property['price'];
            
            // Add user_id to data
            $data['user_id'] = $currentUser['user_id'];
            $data['total_price'] = $totalPrice;
            $data['status'] = 'pending';
            
            try {
                $reservation = $reservationModel->create($data);
                echo ApiResponse::success($reservation, 'Reservation created successfully', 201);
            } catch (Exception $e) {
                echo ApiResponse::error('Failed to create reservation: ' . $e->getMessage());
            }
        }
        break;
        
    case 'PUT':
        // Update reservation
        if (!$id) {
            echo ApiResponse::error('Reservation ID is required');
            exit;
        }
        
        // Get the reservation
        $reservation = $reservationModel->getById($id);
        
        if (!$reservation) {
            echo ApiResponse::notFound('Reservation not found');
            exit;
        }
        
        // Check if user owns the reservation or is admin
        if ($reservation['user_id'] != $currentUser['user_id'] && !$currentUser['is_admin']) {
            echo ApiResponse::unauthorized('You do not have permission to update this reservation');
            exit;
        }
        
        // Get request data
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            echo ApiResponse::error('Invalid request data');
            exit;
        }
        
        try {
            $updatedReservation = $reservationModel->update($id, $data);
            echo ApiResponse::success($updatedReservation, 'Reservation updated successfully');
        } catch (Exception $e) {
            echo ApiResponse::error('Failed to update reservation: ' . $e->getMessage());
        }
        break;
        
    case 'DELETE':
        // Delete reservation
        if (!$id) {
            echo ApiResponse::error('Reservation ID is required');
            exit;
        }
        
        // Get the reservation
        $reservation = $reservationModel->getById($id);
        
        if (!$reservation) {
            echo ApiResponse::notFound('Reservation not found');
            exit;
        }
        
        // Check if user owns the reservation or is admin
        if ($reservation['user_id'] != $currentUser['user_id'] && !$currentUser['is_admin']) {
            echo ApiResponse::unauthorized('You do not have permission to delete this reservation');
            exit;
        }
        
        try {
            $result = $reservationModel->delete($id);
            
            if ($result) {
                echo ApiResponse::success(null, 'Reservation deleted successfully', 204);
            } else {
                echo ApiResponse::error('Failed to delete reservation');
            }
        } catch (Exception $e) {
            echo ApiResponse::error('Failed to delete reservation: ' . $e->getMessage());
        }
        break;
        
    default:
        echo ApiResponse::error('Method not allowed', null, 405);
        break;
}
