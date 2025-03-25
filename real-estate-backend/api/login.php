<?php
// Set content type to JSON
header('Content-Type: application/json');

// Set CORS headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Log the login attempt
error_log("Login attempt received");

try {
    // Get request body
    $data = json_decode(file_get_contents('php://input'), true);
    error_log("Login data: " . json_encode($data));
    
    // Validate required fields
    if (empty($data['email']) || empty($data['password'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Email and password are required'
        ]);
        exit;
    }
    
    // Include database configuration
    $config = require_once __DIR__ . '/../config/database.php';
    error_log("Database config loaded: " . $config['database']);
    
    // Connect to database directly (without using Database class)
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}",
        $config['username'],
        $config['password'],
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
    error_log("Connected to database");
    
    // Get user by email
    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $data['email']]);
    $user = $stmt->fetch();
    
    // Check if user exists
    if (!$user) {
        error_log("User not found: " . $data['email']);
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email or password'
        ]);
        exit;
    }
    
    error_log("User found: " . json_encode($user));
    
    // Validate password (plain text for demo)
    if ($data['password'] !== $user['password']) {
        error_log("Invalid password for user: " . $data['email']);
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email or password'
        ]);
        exit;
    }
    
    error_log("Password validated for user: " . $data['email']);
    
    // Generate simple token
    $token = bin2hex(random_bytes(32));
    
    // Remove password from response
    unset($user['password']);
    
    // Success response
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful',
        'data' => [
            'token' => $token,
            'user' => $user
        ]
    ]);
    
    error_log("Login successful for user: " . $data['email']);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error occurred. Please try again later.'
    ]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'An error occurred. Please try again later.'
    ]);
}
