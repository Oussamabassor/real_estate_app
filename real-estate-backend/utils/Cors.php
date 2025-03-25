<?php

class Cors {
    /**
     * Set CORS headers for all responses
     * 
     * @param string $allowedOrigin The allowed origin (use * for development or specific origin for production)
     * @return void
     */
    public static function handleCors($allowedOrigin = 'http://localhost:5173') {
        // Set headers
        header('Access-Control-Allow-Origin: ' . $allowedOrigin);
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Credentials: true');
        
        // Handle preflight OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            header('Content-Type: application/json');
            http_response_code(200);
            exit;
        }
    }
}
