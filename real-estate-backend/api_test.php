<?php
// Clear any previously sent headers to avoid duplication
header_remove('Access-Control-Allow-Origin');

// Set CORS headers correctly
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, cache-control');
header('Access-Control-Max-Age: 86400'); // 24 hours cache for preflight requests

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Just return with headers, no content
    exit(0);
}

// API test response
header('Content-Type: application/json');

$response = [
    'status' => 'success',
    'message' => 'API connection successful',
    'timestamp' => date('Y-m-d H:i:s'),
    'environment' => [
        'php_version' => phpversion(),
        'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'unknown'
    ]
];

echo json_encode($response);
?>