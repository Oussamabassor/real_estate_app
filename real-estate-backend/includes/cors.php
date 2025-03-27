<?php
/**
 * Set CORS headers for API responses
 * This file should be included at the top of any API endpoint file
 */

// Remove any existing CORS headers to prevent duplication
header_remove('Access-Control-Allow-Origin');

// Define allowed origins
$allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'  // Adding this as a common development port
];

// Get the origin of the request
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Check if the origin is in the allowed list
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // If origin is not in the allowed list, you can either:
    // 1. Set a default origin: header('Access-Control-Allow-Origin: http://localhost:5173');
    // 2. Or deny access by not setting the header
    header("Access-Control-Allow-Origin: http://localhost:5173");
}

// Set other CORS headers
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, cache-control');
header('Access-Control-Allow-Credentials: true'); // Allow credentials
header('Access-Control-Max-Age: 86400'); // 24 hours cache for preflight requests

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Just return with headers, no content
    http_response_code(200);
    exit(0);
}
?>
