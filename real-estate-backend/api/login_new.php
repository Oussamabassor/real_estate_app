<?php
// Set proper headers to allow CORS (Cross-Origin Resource Sharing)
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure this is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Only POST requests are accepted.'
    ]);
    exit;
}

// Load required files
require_once __DIR__ . '/../utils/Database.php';

// Get the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);

// Log the login attempt (for debugging)
error_log('Login attempt with data: ' . json_encode($data));

// Validate the input data
if (empty($data['email']) || empty($data['password'])) {
    http_response_code(400); // Bad Request
    echo json_encode([
        'status' => 'error',
        'message' => 'Email and password are required'
    ]);
    exit;
}

try {
    // Get a database connection
    $db = Database::getInstance()->getConnection();
    
    // Query for the user with the given email
    $stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->bindParam(':email', $data['email']);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // If no user was found or password doesn't match
    if (!$user || $user['password'] !== $data['password']) {
        http_response_code(401); // Unauthorized
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email or password'
        ]);
        exit;
    }
    
    // User authenticated successfully
    // Generate a token (simple implementation for demo)
    $tokenData = [
        'id' => $user['id'],
        'email' => $user['email'],
        'role' => $user['role'],
        'exp' => time() + (60 * 60 * 24) // Token expires in 24 hours
    ];
    
    // In a real application, you would use a proper JWT library
    // For this demo, we'll create a simple token
    $token = base64_encode(json_encode($tokenData));
    
    // Remove sensitive information before sending the response
    unset($user['password']);
    
    // Send successful response
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful',
        'data' => [
            'token' => $token,
            'user' => $user
        ]
    ]);
    
    // Log successful login
    error_log("User {$user['email']} (ID: {$user['id']}) logged in successfully");
    
} catch (PDOException $e) {
    error_log("Database error during login: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'error',
        'message' => 'An error occurred while processing your request'
    ]);
} catch (Exception $e) {
    error_log("General error during login: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'error',
        'message' => 'An error occurred while processing your request'
    ]);
}