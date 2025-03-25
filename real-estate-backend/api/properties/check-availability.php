<?php
require_once __DIR__ . '/../../utils/ApiResponse.php';
require_once __DIR__ . '/../../models/Property.php';

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo ApiResponse::error('Method not allowed', null, 405);
    exit;
}

// Parse the URI to get property ID
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($uri, '/'));

// Check if URI starts with 'api' and remove it
if (isset($uri[0]) && $uri[0] === 'api') {
    array_shift($uri);
}

// Find property ID
$propertyId = null;
foreach ($uri as $key => $value) {
    if ($value === 'properties' && isset($uri[$key + 1]) && is_numeric($uri[$key + 1])) {
        $propertyId = (int) $uri[$key + 1];
        break;
    }
}

if (!$propertyId) {
    echo ApiResponse::error('Property ID is required');
    exit;
}

// Get query parameters
$checkInDate = $_GET['start_date'] ?? null;
$checkOutDate = $_GET['end_date'] ?? null;

// Validate dates
if (!$checkInDate || !$checkOutDate) {
    echo ApiResponse::validationError([
        'start_date' => !$checkInDate ? 'Start date is required' : null,
        'end_date' => !$checkOutDate ? 'End date is required' : null
    ]);
    exit;
}

// Initialize property model
$propertyModel = new Property();

// Check availability
try {
    $result = $propertyModel->checkAvailability($propertyId, $checkInDate, $checkOutDate);
    echo ApiResponse::success($result);
} catch (Exception $e) {
    echo ApiResponse::error('Failed to check availability: ' . $e->getMessage());
}
