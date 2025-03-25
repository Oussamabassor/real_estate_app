<?php
require_once __DIR__ . '/../../utils/ApiResponse.php';
require_once __DIR__ . '/../../utils/Auth.php';
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

// Initialize property model
$propertyModel = new Property();

// Get request method and URI
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// Find the property ID if present
$id = null;
foreach ($uri as $key => $value) {
    if ($value === 'properties' && isset($uri[$key + 1]) && is_numeric($uri[$key + 1])) {
        $id = (int) $uri[$key + 1];
        break;
    }
}

// Check for featured route
$featured = false;
foreach ($uri as $key => $value) {
    if ($value === 'properties' && isset($uri[$key + 1]) && $uri[$key + 1] === 'featured') {
        $featured = true;
        break;
    }
}

// Handle the request based on method and URI
switch ($method) {
    case 'GET':
        if ($featured) {
            // Get featured properties
            $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 6;
            $properties = $propertyModel->getFeatured($limit);
            echo ApiResponse::success($properties);
        } elseif ($id) {
            // Get a single property
            $property = $propertyModel->getById($id);
            
            if ($property) {
                echo ApiResponse::success($property);
            } else {
                echo ApiResponse::notFound('Property not found');
            }
        } else {
            // Get all properties with pagination and filters
            $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
            $perPage = isset($_GET['per_page']) ? (int) $_GET['per_page'] : 10;
            
            // Build filters array from query parameters
            $filters = [];
            if (isset($_GET['property_type'])) $filters['property_type'] = $_GET['property_type'];
            if (isset($_GET['min_price'])) $filters['min_price'] = (float) $_GET['min_price'];
            if (isset($_GET['max_price'])) $filters['max_price'] = (float) $_GET['max_price'];
            if (isset($_GET['bedrooms'])) $filters['bedrooms'] = (int) $_GET['bedrooms'];
            if (isset($_GET['bathrooms'])) $filters['bathrooms'] = (int) $_GET['bathrooms'];
            if (isset($_GET['search'])) $filters['search'] = $_GET['search'];
            
            $result = $propertyModel->getAll($page, $perPage, $filters);
            echo ApiResponse::success($result);
        }
        break;
        
    case 'POST':
        // Create a new property - requires authentication
        $currentUser = Auth::getCurrentUser();
        
        if (!$currentUser) {
            echo ApiResponse::unauthorized('You must be logged in to create a property');
            break;
        }
        
        // Get request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            echo ApiResponse::error('Invalid request data');
            break;
        }
        
        // Validate required fields
        $requiredFields = ['title', 'description', 'price', 'property_type', 'bedrooms', 'bathrooms', 'area'];
        $errors = [];
        
        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $errors[$field] = "The $field field is required";
            }
        }
        
        if (!empty($errors)) {
            echo ApiResponse::validationError($errors);
            break;
        }
        
        // Add owner ID from authenticated user
        $data['owner_id'] = $currentUser['user_id'];
        
        // Handle image uploads if any
        if (isset($_FILES['images'])) {
            $data['images'] = [];
            
            foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
                $filename = uniqid() . '_' . $_FILES['images']['name'][$key];
                $uploadPath = __DIR__ . '/../../uploads/properties/' . $filename;
                
                if (move_uploaded_file($tmp_name, $uploadPath)) {
                    $data['images'][] = '/uploads/properties/' . $filename;
                }
            }
        }
        
        $property = $propertyModel->create($data);
        echo ApiResponse::success($property, 'Property created successfully', 201);
        break;
        
    case 'PUT':
        // Update an existing property
        if (!$id) {
            echo ApiResponse::error('Property ID is required');
            break;
        }
        
        $currentUser = Auth::getCurrentUser();
        
        if (!$currentUser) {
            echo ApiResponse::unauthorized('You must be logged in to update a property');
            break;
        }
        
        // Get request body
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            echo ApiResponse::error('Invalid request data');
            break;
        }
        
        // Check if user owns the property or is admin
        $property = $propertyModel->getById($id);
        
        if (!$property) {
            echo ApiResponse::notFound('Property not found');
            break;
        }
        
        if ($property['owner_id'] != $currentUser['user_id'] && !$currentUser['is_admin']) {
            echo ApiResponse::unauthorized('You do not have permission to update this property');
            break;
        }
        
        $updatedProperty = $propertyModel->update($id, $data);
        echo ApiResponse::success($updatedProperty, 'Property updated successfully');
        break;
        
    case 'DELETE':
        // Delete a property
        if (!$id) {
            echo ApiResponse::error('Property ID is required');
            break;
        }
        
        $currentUser = Auth::getCurrentUser();
        
        if (!$currentUser) {
            echo ApiResponse::unauthorized('You must be logged in to delete a property');
            break;
        }
        
        // Check if user owns the property or is admin
        $property = $propertyModel->getById($id);
        
        if (!$property) {
            echo ApiResponse::notFound('Property not found');
            break;
        }
        
        if ($property['owner_id'] != $currentUser['user_id'] && !$currentUser['is_admin']) {
            echo ApiResponse::unauthorized('You do not have permission to delete this property');
            break;
        }
        
        $propertyModel->delete($id);
        echo ApiResponse::success(null, 'Property deleted successfully', 204);
        break;
        
    default:
        echo ApiResponse::error('Method not allowed', null, 405);
        break;
}
