<?php

class JWT {
    private $secret;
    
    public function __construct() {
        // In production, get this from an environment variable
        $this->secret = 'your_jwt_secret_key_change_this_in_production';
    }
    
    public function encode($payload) {
        $header = $this->base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = $this->base64UrlEncode(json_encode($payload));
        $signature = $this->base64UrlEncode(hash_hmac('sha256', "$header.$payload", $this->secret, true));
        
        return "$header.$payload.$signature";
    }
    
    public function decode($token) {
        list($header, $payload, $signature) = explode('.', $token);
        
        $decodedSignature = $this->base64UrlEncode(hash_hmac('sha256', "$header.$payload", $this->secret, true));
        
        if ($signature !== $decodedSignature) {
            throw new Exception('Invalid signature');
        }
        
        return json_decode($this->base64UrlDecode($payload), true);
    }
    
    private function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
