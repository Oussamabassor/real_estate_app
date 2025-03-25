<?php
require_once __DIR__ . '/JWT.php';

class Auth {
    private static $jwt;
    
    public static function init() {
        self::$jwt = new JWT();
    }
    
    public static function generateToken($user) {
        if (!self::$jwt) {
            self::init();
        }
        
        // Remove sensitive data
        unset($user['password']);
        
        // Create payload
        $payload = [
            'user_id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'is_admin' => $user['role'] === 'admin',
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24 * 7) // Token valid for 7 days
        ];
        
        return self::$jwt->encode($payload);
    }
    
    public static function validateToken($token) {
        if (!self::$jwt) {
            self::init();
        }
        
        try {
            $payload = self::$jwt->decode($token);
            
            // Check if token is expired
            if (isset($payload['exp']) && $payload['exp'] < time()) {
                return false;
            }
            
            return $payload;
        } catch (Exception $e) {
            return false;
        }
    }
    
    public static function getAuthorizationHeader() {
        $headers = null;
        
        if (isset($_SERVER['Authorization'])) {
            $headers = trim($_SERVER['Authorization']);
        } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
        } else if (function_exists('apache_request_headers')) {
            $requestHeaders = apache_request_headers();
            $requestHeaders = array_combine(
                array_map('ucwords', array_keys($requestHeaders)),
                array_values($requestHeaders)
            );
            
            if (isset($requestHeaders['Authorization'])) {
                $headers = trim($requestHeaders['Authorization']);
            }
        }
        
        return $headers;
    }
    
    public static function getBearerToken() {
        $headers = self::getAuthorizationHeader();
        
        if (!empty($headers)) {
            if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
                return $matches[1];
            }
        }
        
        return null;
    }
    
    public static function getCurrentUser() {
        $token = self::getBearerToken();
        
        if (!$token) {
            return null;
        }
        
        $payload = self::validateToken($token);
        
        if (!$payload) {
            return null;
        }
        
        return $payload;
    }
}
