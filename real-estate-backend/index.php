<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Important: Set CORS headers properly
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');

// Log all requests
error_log("Request received: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);

// Handle direct file access for utility scripts
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$utilityScripts = [
    '/setup_database.php', 
    '/db_test.php',
    '/server.php',
    '/login_debug.php'
];

// Check if the request is for a direct utility script
foreach ($utilityScripts as $script) {
    if ($requestPath === $script) {
        error_log("Directly accessing utility script: " . $script);
        $filePath = __DIR__ . $script;
        
        if (file_exists($filePath)) {
            error_log("Found file at: " . $filePath);
            require_once $filePath;
            exit;
        } else {
            error_log("File not found: " . $filePath);
        }
    }
}

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Responding to OPTIONS request");
    http_response_code(200);
    exit;
}

// Parse request URI for API routing
$uri = explode('/', trim($requestPath, '/'));

// Remove empty entries and reindex
$uri = array_values(array_filter($uri));

error_log("Parsed URI components: " . json_encode($uri));

// If the URI starts with 'api', remove it
if (isset($uri[0]) && $uri[0] === 'api') {
    array_shift($uri);
    error_log("Removed 'api' from URI, new components: " . json_encode($uri));
}

// Route based on the URI
if (empty($uri)) {
    // Root API endpoint
    error_log("Serving root API endpoint");
    header('Content-Type: application/json');
    echo json_encode([
        'status' => 'success',
        'message' => 'Welcome to the Real Estate API',
        'version' => '1.0.0',
        'utility_scripts' => [
            'Database Setup' => '/setup_database.php',
            'Database Test' => '/db_test.php'
        ]
    ]);
    exit;
} else {
    error_log("Routing to: " . $uri[0]);
    
    switch ($uri[0]) {
        case 'login':
            if (file_exists(__DIR__ . '/api/login_debug.php')) {
                require_once __DIR__ . '/api/login_debug.php';
            } else {
                require_once __DIR__ . '/api/auth/login.php';
            }
            break;
            
        case 'register':
            require_once __DIR__ . '/api/auth/register.php';
            break;
            
        case 'profile':
            require_once __DIR__ . '/api/auth/profile.php';
            break;
            
        case 'properties':
            // Property routes
            if (isset($uri[1]) && $uri[1] === 'featured') {
                require_once __DIR__ . '/api/properties/featured.php';
            } else {
                require_once __DIR__ . '/api/properties/index.php';
            }
            break;
            
        case 'stats':
            require_once __DIR__ . '/api/stats.php';
            break;
            
        default:
            header('Content-Type: application/json');
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Endpoint not found: ' . $uri[0]
            ]);
            break;
    }
}
