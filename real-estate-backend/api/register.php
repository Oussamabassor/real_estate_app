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

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Get request body
$data = json_decode(file_get_contents('php://input'), true);
error_log('Registration request: ' . json_encode($data));

// Validate input
if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Name, email and password are required'
    ]);
    exit;
}

try {
    $userModel = new User();
    
    // Check if email already exists
    $existingUser = $userModel->getByEmail($data['email']);
    if ($existingUser) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Email already exists'
        ]);
        exit;
    }
    
    // Prepare user data
    $userData = [
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => $data['password'], // Not hashing for demo
        'role' => 'user'
    ];
    
    // Create user
    $user = $userModel->create($userData);
    
    if (!$user) {
        throw new Exception('Failed to create user');
    }
    
    // Generate a simple token
    $token = md5($user['id'] . $user['email'] . time());
    
    // Success response
    http_response_code(201);
    echo json_encode([
        'status' => 'success',
        'message' => 'Registration successful',
        'data' => [
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role']
            ]
        ]
    ]);
    
} catch (Exception $e) {
    error_log('Registration error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Registration failed: ' . $e->getMessage()
    ]);
}
