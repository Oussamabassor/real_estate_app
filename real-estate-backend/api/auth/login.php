<?php
require_once __DIR__ . '/../../utils/ApiResponse.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Auth.php';
require_once __DIR__ . '/../../models/User.php';

// Handle CORS
Cors::handleCors();

// Set content type
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo ApiResponse::error('Method not allowed', null, 405);
    exit;
}

// Get request data
$data = json_decode(file_get_contents('php://input'), true);

// Debug incoming data
error_log("Login attempt with: " . json_encode($data));

// Validate required fields
if (empty($data['email']) || empty($data['password'])) {
    echo ApiResponse::validationError([
        'email' => empty($data['email']) ? 'Email is required' : null,
        'password' => empty($data['password']) ? 'Password is required' : null
    ]);
    exit;
}

// Get user by email
$userModel = new User();
$user = $userModel->getByEmail($data['email']);

// Debug user retrieval
if ($user) {
    error_log("User found: " . json_encode($user));
} else {
    error_log("No user found with email: " . $data['email']);
    echo ApiResponse::error('Invalid email or password', null, 401);
    exit;
}

// For simplicity, compare passwords directly (since they're stored as plain text in your DB)
// In a real app, you'd use password_verify() with hashed passwords
if ($data['password'] !== $user['password']) {
    error_log("Password mismatch for user: " . $data['email']);
    echo ApiResponse::error('Invalid email or password', null, 401);
    exit;
}

// Generate JWT token
$token = Auth::generateToken($user);

// Return user data and token
unset($user['password']);

echo ApiResponse::success([
    'user' => $user,
    'token' => $token
], 'Login successful');
