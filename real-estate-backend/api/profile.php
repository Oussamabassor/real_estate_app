<?php
require_once __DIR__ . '/../utils/Database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Cors.php';

// Apply CORS headers consistently across all endpoints
Cors::handleCors('http://localhost:5173');

// Set content type to JSON
header('Content-Type: application/json');

// Handle preflight requests - already handled by Cors::handleCors()
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Mock authentication for demo purposes
// In a real app, validate the token from Authorization header
$userId = 1; // Mock user ID

try {
    $userModel = new User();
    $user = $userModel->getById($userId);
    
    if (!$user) {
        http_response_code(404);
        echo json_encode([
            'status' => 'error',
            'message' => 'User not found'
        ]);
        exit;
    }
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Profile retrieved',
        'data' => [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'created_at' => $user['created_at']
        ]
    ]);
    
} catch (Exception $e) {
    error_log('Profile error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Failed to get profile: ' . $e->getMessage()
    ]);
}
