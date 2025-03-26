<?php
// Set proper headers to allow CORS (Cross-Origin Resource Sharing)
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Ensure this is a GET request
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'status' => 'error',
        'message' => 'Method not allowed. Only GET requests are accepted.'
    ]);
    exit;
}

// Load required files
require_once __DIR__ . '/../utils/Database.php';

// Check for token in Authorization header
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

// Log the auth header for debugging
error_log('Authorization header: ' . $authHeader);

if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'error',
        'message' => 'Authentication required'
    ]);
    exit;
}

$token = $matches[1];
error_log('Token: ' . $token);

try {
    // Verify token (simple implementation for demo)
    $tokenData = json_decode(base64_decode($token), true);
    
    // Check if token has expected fields and hasn't expired
    if (!isset($tokenData['id']) || !isset($tokenData['email']) || !isset($tokenData['exp']) ||
        $tokenData['exp'] < time()) {
        http_response_code(401); // Unauthorized
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid or expired token'
        ]);
        exit;
    }
    
    // Get user ID from token
    $userId = $tokenData['id'];
    
    // Get a database connection
    $db = Database::getInstance()->getConnection();
    
    // Query for the user with the given ID
    $stmt = $db->prepare("SELECT * FROM users WHERE id = :id");
    $stmt->bindParam(':id', $userId);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // If no user was found
    if (!$user) {
        http_response_code(404); // Not Found
        echo json_encode([
            'status' => 'error',
            'message' => 'User not found'
        ]);
        exit;
    }
    
    // Remove sensitive information before sending the response
    unset($user['password']);
    
    // Send successful response
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Profile retrieved successfully',
        'data' => $user
    ]);
    
    // Log successful profile retrieval
    error_log("Profile for user {$user['email']} (ID: {$user['id']}) retrieved successfully");
    
} catch (Exception $e) {
    error_log("Error during profile retrieval: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'error',
        'message' => 'An error occurred while processing your request'
    ]);
}