<?php
require_once __DIR__ . '/../../utils/ApiResponse.php';
require_once __DIR__ . '/../../utils/Cors.php';
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
} elseif (strlen($data['password']) < 6) {
    $errors['password'] = 'Password must be at least 6 characters';
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
    echo ApiResponse::validationError(['email' => 'Email already exists']);
    exit;
}

// Create user
try {
    $user = $userModel->create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => $data['password'],
        'is_admin' => 0,
        'is_verified' => 1 // Auto-verify for testing
    ]);

    // Generate JWT token
    require_once __DIR__ . '/../../utils/Auth.php';
    $token = Auth::generateToken($user);

    // Return user data and token
    unset($user['password']);

    echo ApiResponse::success([
        'user' => $user,
        'token' => $token
    ], 'User registered successfully', 201);
} catch (Exception $e) {
    echo ApiResponse::error('Registration failed: ' . $e->getMessage(), null, 500);
}
