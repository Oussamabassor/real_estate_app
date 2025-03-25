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
error_log("Registration attempt with: " . json_encode($data));

// Validate required fields
$errors = [];

if (empty($data['name'])) {
    $errors['name'] = 'Name is required';
}

if (empty($data['email'])) {
    $errors['email'] = 'Email is required';
} elseif (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Email is invalid';
}

if (empty($data['password'])) {
    $errors['password'] = 'Password is required';
}

// Return validation errors if any
if (!empty($errors)) {
    echo ApiResponse::validationError($errors);
    exit;
}

// Check if email already exists
$userModel = new User();
$existingUser = $userModel->getByEmail($data['email']);

if ($existingUser) {
    error_log("Email already exists: " . $data['email']);
    echo ApiResponse::validationError(['email' => 'Email already exists']);
    exit;
}

// Create user
try {
    $userData = [
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => $data['password'], // Store as plain text (for demo only)
        'role' => 'user'
    ];
    
    error_log("Creating user with data: " . json_encode($userData));
    
    $user = $userModel->create($userData);
    
    if (!$user) {
        throw new Exception('Failed to create user');
    }
    
    // Generate JWT token
    $token = Auth::generateToken($user);
    
    // Return user data and token
    unset($user['password']);
    
    echo ApiResponse::success([
        'user' => $user,
        'token' => $token
    ], 'User registered successfully', 201);
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    echo ApiResponse::error('Registration failed: ' . $e->getMessage(), null, 500);
}
