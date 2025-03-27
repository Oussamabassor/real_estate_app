<?php
// Include the CORS handling
require_once '../includes/cors.php';

// Set content type for API
header('Content-Type: application/json');

// API response
$response = [
    'status' => 'success',
    'message' => 'API is running',
    'version' => '1.0.0',
    'endpoints' => [
        '/api/properties',
        '/api/users',
        '/api/reservations'
    ]
];

echo json_encode($response);
?>
