<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set content type
header('Content-Type: application/json');

// Function to respond with error
function respondWithError($statusCode, $message) {
    http_response_code($statusCode);
    echo json_encode([
        'status' => 'error',
        'message' => $message
    ]);
    exit;
}

// Include CORS headers for local development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

try {
    // This is a test endpoint that simulates successful registration
    // without actually creating a database record
    
    // Get the request body (for POST requests)
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $requestBody = file_get_contents('php://input');
        $data = json_decode($requestBody, true);
        
        // Log the registration attempt for debugging
        error_log('Test registration attempt with data: ' . $requestBody);
        
        // Validate the input data
        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            respondWithError(400, 'Name, email and password are required');
        }
        
        // Return a success response
        http_response_code(201); // Created
        echo json_encode([
            'status' => 'success',
            'message' => 'Registration successful',
            'data' => [
                'token' => 'test_token_' . md5(time()),
                'user' => [
                    'id' => 1,
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'role' => 'user'
                ]
            ]
        ]);
    } else {
        // For GET requests, just return info about the endpoint
        echo json_encode([
            'status' => 'success',
            'message' => 'Registration test endpoint is working. Send a POST request with name, email, and password to test registration.'
        ]);
    }
} catch (Exception $e) {
    error_log('Test registration error: ' . $e->getMessage());
    respondWithError(500, 'An error occurred: ' . $e->getMessage());
}
?>