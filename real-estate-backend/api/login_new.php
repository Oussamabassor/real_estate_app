<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Include CORS handling file
require_once __DIR__ . '/../includes/cors.php';

// Set content type
header('Content-Type: application/json');

// Function to respond with error
function respondWithError($statusCode, $message) {
    http_response_code($statusCode);
    echo json_encode([
        'status' => 'error',
        'message' => $message
    ]);
    exit;
}

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Ensure this is a POST request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondWithError(405, 'Method not allowed. Only POST requests are accepted.');
}

try {
    // Get the request body
    $requestBody = file_get_contents('php://input');
    $data = json_decode($requestBody, true);
    
    // Log the login attempt (for debugging)
    error_log('Login attempt with data: ' . json_encode($data));
    
    // Validate the input data
    if (empty($data['email']) || empty($data['password'])) {
        respondWithError(400, 'Email and password are required');
    }
    
    // Check if config file exists
    $configFile = __DIR__ . '/../config/database.php';
    if (!file_exists($configFile)) {
        respondWithError(500, 'Database configuration file not found');
    }
    
    // Load database configuration
    $config = require_once $configFile;
    
    try {
        // Create database connection with PDO - using empty password
        $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        
        // Note: Using empty string for password
        $pdo = new PDO($dsn, $config['username'], '', $options);
        
        // Query for the user with the given email
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute(['email' => $data['email']]);
        $user = $stmt->fetch();
        
        // Log the user lookup result
        error_log("User found: " . ($user ? "Yes" : "No"));
        
        // If no user was found
        if (!$user) {
            respondWithError(401, 'Invalid email or password');
        }
        
        // Check for password verification method
        $passwordMatches = false;
        
        // First try with password_verify for hashed passwords
        if (function_exists('password_verify') && password_verify($data['password'], $user['password'])) {
            $passwordMatches = true;
        } 
        // Fallback to direct comparison for plaintext passwords (development only)
        else if ($user['password'] === $data['password']) {
            $passwordMatches = true;
            error_log("WARNING: Using plain text password comparison for user {$user['email']}");
        }
        
        // If password doesn't match
        if (!$passwordMatches) {
            respondWithError(401, 'Invalid email or password');
        }
        
        // Generate a simple token (for development purposes)
        $tokenData = [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'] ?? 'user',
            'exp' => time() + (60 * 60 * 24) // Token expires in 24 hours
        ];
        
        // In a real application, you would use a proper JWT library
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
        error_log("PDO Exception in login: " . $e->getMessage());
        respondWithError(500, 'Database error: ' . $e->getMessage());
    }
} catch (Exception $e) {
    error_log("General Exception in login: " . $e->getMessage());
    respondWithError(500, 'An error occurred: ' . $e->getMessage());
}
?>