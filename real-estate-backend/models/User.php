<?php
require_once __DIR__ . '/../utils/Database.php';

class User {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT id, name, email, profile_image, address, city, state, zip_code, is_admin, is_verified, created_at FROM users WHERE id = :id");
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    public function getByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    public function create($data) {
        $sql = "INSERT INTO users (name, email, password, address, city, state, zip_code, is_admin, is_verified) 
                VALUES (:name, :email, :password, :address, :city, :state, :zip_code, :is_admin, :is_verified)";
        
        $stmt = $this->db->prepare($sql);
        
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        $stmt->bindValue(':name', $data['name']);
        $stmt->bindValue(':email', $data['email']);
        $stmt->bindValue(':password', $hashedPassword);
        $stmt->bindValue(':address', $data['address'] ?? null);
        $stmt->bindValue(':city', $data['city'] ?? null);
        $stmt->bindValue(':state', $data['state'] ?? null);
        $stmt->bindValue(':zip_code', $data['zip_code'] ?? null);
        $stmt->bindValue(':is_admin', $data['is_admin'] ?? 0);
        $stmt->bindValue(':is_verified', $data['is_verified'] ?? 0);
        
        $stmt->execute();
        $id = $this->db->lastInsertId();
        
        return $this->getById($id);
    }
    
    public function update($id, $data) {
        $sql = "UPDATE users SET 
                    name = COALESCE(:name, name),
                    address = COALESCE(:address, address),
                    city = COALESCE(:city, city),
                    state = COALESCE(:state, state),
                    zip_code = COALESCE(:zip_code, zip_code),
                    profile_image = COALESCE(:profile_image, profile_image)
                WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':name', $data['name'] ?? null);
        $stmt->bindValue(':address', $data['address'] ?? null);
        $stmt->bindValue(':city', $data['city'] ?? null);
        $stmt->bindValue(':state', $data['state'] ?? null);
        $stmt->bindValue(':zip_code', $data['zip_code'] ?? null);
        $stmt->bindValue(':profile_image', $data['profile_image'] ?? null);
        
        $stmt->execute();
        
        return $this->getById($id);
    }
}
