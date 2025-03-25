<?php
require_once __DIR__ . '/../utils/Database.php';

// Set CORS headers
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Enable detailed error logging
error_log("--- Login Debug Endpoint Called ---");

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    error_log("Method not allowed: " . $_SERVER['REQUEST_METHOD']);
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
    exit;
}

// Get request body
$rawInput = file_get_contents('php://input');
error_log("Raw input: " . $rawInput);

$data = json_decode($rawInput, true);
error_log("Decoded input: " . json_encode($data));

// Validate input
if (!$data) {
    error_log("Invalid JSON data");
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid JSON data'
    ]);
    exit;
}

if (empty($data['email']) || empty($data['password'])) {
    error_log("Missing required fields: " . json_encode([
        'email' => empty($data['email']),
        'password' => empty($data['password'])
    ]));
    
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Email and password are required',
        'fields' => [
            'email' => empty($data['email']) ? 'Email is required' : null,
            'password' => empty($data['password']) ? 'Password is required' : null
        ]
    ]);
    exit;
}

try {
    // Get database connection
    $db = Database::getInstance()->getConnection();
    error_log("Database connection successful");
    
    // First check if users table exists
    $tablesQuery = $db->query("SHOW TABLES LIKE 'users'");
    if ($tablesQuery->rowCount() === 0) {
        error_log("Users table does not exist");
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database schema issue: users table does not exist'
        ]);
        exit;
    }
    
    // Check email format
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        error_log("Invalid email format: " . $data['email']);
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email format'
        ]);
        exit;
    }
    
    // Get column info for users table
    $columnQuery = $db->query("DESCRIBE users");
    $columns = $columnQuery->fetchAll(PDO::FETCH_COLUMN);
    error_log("Users table columns: " . implode(", ", $columns));
    
    // Check if required columns exist
    $requiredColumns = ['id', 'email', 'password', 'name'];
    $missingColumns = array_diff($requiredColumns, $columns);
    
    if (!empty($missingColumns)) {
        error_log("Missing required columns: " . implode(", ", $missingColumns));
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Database schema issue: missing columns: ' . implode(", ", $missingColumns)
        ]);
        exit;
    }
    
    // Get the user by email
    error_log("Looking up user with email: " . $data['email']);
    $stmt = $db->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->bindValue(':email', $data['email']);
    $stmt->execute();
    
    $user = $stmt->fetch();
    
    if (!$user) {
        error_log("User not found with email: " . $data['email']);
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email or password'
        ]);
        exit;
    }
    
    error_log("User found: " . json_encode($user));
    
    // Validate password (using plain text comparison for debugging)
    error_log("Comparing passwords - Input: " . $data['password'] . ", Stored: " . $user['password']);
    
    if ($data['password'] !== $user['password']) {
        error_log("Password mismatch for: " . $data['email']);
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid email or password'
        ]);
        exit;
    }
    
    error_log("Password verified successfully");
    
    // Generate a simple token
    $token = bin2hex(random_bytes(32));
    error_log("Generated token: " . $token);
    
    // Success response
    error_log("Login successful");
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Login successful',
        'data' => [
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email'],
                'role' => $user['role'] ?? 'user'
            ]
        ]
    ]);
    
} catch (PDOException $e) {
    error_log("Database error: " . $e->getMessage());
    error_log("Database error trace: " . json_encode($e->getTrace()));
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error: ' . $e->getMessage(),
        'debug_info' => [
            'error_code' => $e->getCode(),
            'error_line' => $e->getLine(),
            'error_file' => $e->getFile()
        ]
    ]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'message' => 'Login failed: ' . $e->getMessage()
    ]);
}
