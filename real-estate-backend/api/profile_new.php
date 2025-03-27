<?php
// Include CORS handling file
require_once __DIR__ . '/../includes/cors.php';

// Set content type
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
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

// Get the authorization header
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

// Check if Authorization header is present and has Bearer token
if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401); // Unauthorized
    echo json_encode([
        'status' => 'error',
        'message' => 'Authentication required'
    ]);
    exit;
}

// Extract the token
$token = $matches[1];
error_log("Token received: " . substr($token, 0, 20) . "...");

try {
    // Decode the token (simple implementation for development)
    $tokenData = json_decode(base64_decode($token), true);
    
    // Validate token structure
    if (!isset($tokenData['id']) || !isset($tokenData['email']) || !isset($tokenData['exp'])) {
        http_response_code(401); // Unauthorized
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid token structure'
        ]);
        exit;
    }
    
    // Check if token has expired
    if ($tokenData['exp'] < time()) {
        http_response_code(401); // Unauthorized
        echo json_encode([
            'status' => 'error',
            'message' => 'Token has expired'
        ]);
        exit;
    }
    
    // Get the user ID from the token
    $userId = $tokenData['id'];
    
    // Connect to the database
    require_once __DIR__ . '/../utils/Database.php';
    $db = new Database();
    $conn = $db->getConnection();
    
    // Query for the user
    $stmt = $conn->prepare("SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    
    // If user not found
    if (!$user) {
        http_response_code(404); // Not Found
        echo json_encode([
            'status' => 'error',
            'message' => 'User not found'
        ]);
        exit;
    }
    
    // Return the user profile
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Profile retrieved successfully',
        'data' => $user
    ]);
    
} catch (Exception $e) {
    error_log("Error in profile endpoint: " . $e->getMessage());
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'error',
        'message' => 'An error occurred while processing your request'
    ]);
}
?>