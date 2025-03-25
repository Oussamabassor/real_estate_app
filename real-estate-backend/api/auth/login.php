<?php
require_once __DIR__ . '/../../utils/ApiResponse.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/User.php';

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo ApiResponse::error('Method not allowed', null, 405);
    exit;
}

// Get request body
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo ApiResponse::error('Invalid request data');
    exit;
}

// Validate required fields
if (empty($data['email']) || empty($data['password'])) {
    echo ApiResponse::validationError([
        'email' => empty($data['email']) ? 'Email is required' : null,
        'password' => empty($data['password']) ? 'Password is required' : null
    ]);
    exit;
}

// Initialize user model
$userModel = new User();

// Check if user exists
$user = $userModel->getByEmail($data['email']);

if (!$user) {
    echo ApiResponse::error('Invalid email or password', null, 401);
    exit;
}

// Verify password
if (!password_verify($data['password'], $user['password'])) {
    echo ApiResponse::error('Invalid email or password', null, 401);
    exit;
}

// Generate token
$token = Auth::generateToken($user);

// Return response
echo ApiResponse::success([
    'user' => [
        'id' => $user['id'],
        'name' => $user['name'],
        'email' => $user['email'],
        'is_admin' => (bool) $user['is_admin'],
        'is_verified' => (bool) $user['is_verified']
    ],
    'token' => $token
], 'Login successful');
