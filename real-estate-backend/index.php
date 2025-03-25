<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Important: Set CORS headers properly
header('Access-Control-Allow-Origin: http://localhost:5173'); // Specifically allow your frontend origin
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Just exit with 200 OK status for OPTIONS requests
    http_response_code(200);
    exit;
}

// Debug mode
$debugMode = true;

// Log request details if in debug mode
if ($debugMode) {
    error_log("API Request: " . $_SERVER['REQUEST_METHOD'] . " " . $_SERVER['REQUEST_URI']);
    
    if (function_exists('getallheaders')) {
        error_log("Headers: " . json_encode(getallheaders()));
    }
    
    // Log request body for POST/PUT
    if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
        $requestBody = file_get_contents('php://input');
        error_log("Request Body: " . $requestBody);
    }
}

// Parse request URI
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($uri, '/'));

// Remove empty entries and reindex
$uri = array_values(array_filter($uri));

// If the URI starts with 'api', remove it
if (isset($uri[0]) && $uri[0] === 'api') {
    array_shift($uri);
}

// Route based on the first segment of the URI
if (empty($uri)) {
    // Root API endpoint
    echo json_encode([
        'status' => 'success',
        'message' => 'Welcome to the Real Estate API',
        'version' => '1.0.0'
    ]);
    exit;
} else {
    // Route to appropriate API endpoints
    switch ($uri[0]) {
        case 'properties':
            // Check for specific property actions
            if (isset($uri[2]) && $uri[2] === 'check-availability') {
                require_once __DIR__ . '/api/properties/check-availability.php';
            } else if (isset($uri[1]) && $uri[1] === 'featured') {
                require_once __DIR__ . '/api/properties/featured.php';
            } else {
                require_once __DIR__ . '/api/properties/index.php';
            }
            break;
            
        case 'reservations':
            require_once __DIR__ . '/api/reservations/index.php';
            break;
            
        case 'auth':
            if (isset($uri[1])) {
                switch ($uri[1]) {
                    case 'login':
                        require_once __DIR__ . '/api/auth/login.php';
                        break;
                    case 'register':
                        require_once __DIR__ . '/api/auth/register.php';
                        break;
                    case 'profile':
                        require_once __DIR__ . '/api/auth/profile.php';
                        break;
                    case 'logout':
                        require_once __DIR__ . '/api/auth/logout.php';
                        break;
                    default:
                        http_response_code(404);
                        echo json_encode(['status' => 'error', 'message' => 'Auth endpoint not found']);
                        break;
                }
            } else {
                http_response_code(404);
                echo json_encode(['status' => 'error', 'message' => 'Auth endpoint requires an action']);
            }
            break;
            
        case 'favorites':
            require_once __DIR__ . '/api/favorites/index.php';
            break;
            
        case 'stats':
            require_once __DIR__ . '/api/stats.php';
            break;
            
        default:
            http_response_code(404);
            echo json_encode([
                'status' => 'error', 
                'message' => 'Endpoint not found',
                'requested_endpoint' => $uri[0]
            ]);
            break;
    }
}
