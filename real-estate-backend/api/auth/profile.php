<?php
require_once __DIR__ . '/../../utils/ApiResponse.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/User.php';

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get current user from token
$currentUser = Auth::getCurrentUser();

if (!$currentUser) {
    echo ApiResponse::unauthorized('You must be logged in to access this resource');
    exit;
}

$userModel = new User();

// GET request - retrieve profile
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user = $userModel->getById($currentUser['user_id']);
    
    if (!$user) {
        echo ApiResponse::notFound('User not found');
        exit;
    }
    
    // Remove sensitive data
    unset($user['password']);
    
    echo ApiResponse::success($user);
}
// PUT request - update profile
else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Get request body
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        echo ApiResponse::error('Invalid request data');
        exit;
    }
    
    $updatedUser = $userModel->update($currentUser['user_id'], $data);
    
    if (!$updatedUser) {
        echo ApiResponse::error('Failed to update profile');
        exit;
    }
    
    // Remove sensitive data
    unset($updatedUser['password']);
    
    echo ApiResponse::success($updatedUser, 'Profile updated successfully');
}
else {
    echo ApiResponse::error('Method not allowed', null, 405);
}
