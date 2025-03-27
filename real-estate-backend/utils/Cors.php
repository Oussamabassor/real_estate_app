<?php

class Cors {
    // Store whether CORS headers have been set
    private static $corsHeadersSet = false;

    /**
     * Set CORS headers for all responses
     * 
     * @param string|array $allowedOrigins The allowed origin(s)
     * @return void
     */
    public static function handleCors($allowedOrigins = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174']) {
        // Only set headers once per request (using class property instead of static variable)
        if (self::$corsHeadersSet) {
            return;
        }

        // Check if headers have already been sent
        if (headers_sent()) {
            return;
        }

        // Clear any output buffers that might contain headers
        while (ob_get_level() > 0) {
            ob_end_clean();
        }

        // Start with a clean slate - remove any potential CORS headers
        foreach (['Access-Control-Allow-Origin', 'Access-Control-Allow-Methods', 
                 'Access-Control-Allow-Headers', 'Access-Control-Allow-Credentials', 
                 'Access-Control-Max-Age'] as $header) {
            header_remove($header);
        }

        // Get the origin header
        $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
        
        // Set Access-Control-Allow-Origin
        if (is_array($allowedOrigins)) {
            if (in_array($origin, $allowedOrigins) || in_array('*', $allowedOrigins)) {
                header("Access-Control-Allow-Origin: $origin", true);
            } else if (!empty($allowedOrigins)) {
                header("Access-Control-Allow-Origin: {$allowedOrigins[0]}", true);
            }
        } else {
            header("Access-Control-Allow-Origin: $allowedOrigins", true);
        }
        
        // Set other CORS headers, using the 'replace' parameter as true
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS', true);
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept-Language', true);
        header('Access-Control-Allow-Credentials: true', true);
        header('Access-Control-Max-Age: 86400', true); // 24 hours
        
        // Mark that CORS headers have been set
        self::$corsHeadersSet = true;
        
        // Handle preflight OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            // Return 204 No Content for OPTIONS requests
            header('Content-Type: text/plain', true);
            header('Content-Length: 0', true);
            http_response_code(204);
            exit;
        }
    }
}
