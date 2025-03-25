<?php

class ApiResponse {
    /**
     * Return a success response
     * 
     * @param mixed $data The data to include in response
     * @param string $message Success message
     * @param int $statusCode HTTP status code
     * @return string JSON response
     */
    public static function success($data = null, $message = 'Success', $statusCode = 200) {
        http_response_code($statusCode);
        return json_encode([
            'status' => 'success',
            'message' => $message,
            'data' => $data
        ]);
    }
    
    /**
     * Return an error response
     * 
     * @param string $message Error message
     * @param mixed $errors Detailed error information
     * @param int $statusCode HTTP status code
     * @return string JSON response
     */
    public static function error($message = 'Error', $errors = null, $statusCode = 400) {
        http_response_code($statusCode);
        return json_encode([
            'status' => 'error',
            'message' => $message,
            'errors' => $errors
        ]);
    }
    
    /**
     * Return a not found response
     * 
     * @param string $message Not found message
     * @return string JSON response
     */
    public static function notFound($message = 'Resource not found') {
        return self::error($message, null, 404);
    }
    
    /**
     * Return an unauthorized response
     * 
     * @param string $message Unauthorized message
     * @return string JSON response
     */
    public static function unauthorized($message = 'Unauthorized') {
        return self::error($message, null, 401);
    }
}
