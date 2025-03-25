<?php
require_once __DIR__ . '/../utils/Database.php';

class User {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT id, name, email, role, created_at FROM users WHERE id = :id");
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
        try {
            // Log the data we're trying to insert
            error_log("Attempting to create user: " . json_encode($data));
            
            // Check if the table exists
            $tableCheck = $this->db->query("SHOW TABLES LIKE 'users'");
            if ($tableCheck->rowCount() === 0) {
                throw new Exception("Table 'users' does not exist");
            }
            
            // Describe the table to check column names
            $columnsCheck = $this->db->query("DESCRIBE users");
            $columns = $columnsCheck->fetchAll(PDO::FETCH_COLUMN);
            error_log("Columns in users table: " . json_encode($columns));
            
            // Build the SQL statement dynamically based on available columns
            $fields = [];
            $placeholders = [];
            $values = [];
            
            foreach ($data as $key => $value) {
                // Map our API field names to database column names if needed
                $dbField = $key;
                if ($key === 'is_admin' && in_array('role', $columns)) {
                    $dbField = 'role';
                    $value = $value ? 'admin' : 'user';
                }
                
                if (in_array($dbField, $columns)) {
                    $fields[] = $dbField;
                    $placeholders[] = ":$dbField";
                    $values[":$dbField"] = $value;
                }
            }
            
            if (empty($fields)) {
                throw new Exception("No valid fields to insert");
            }
            
            $sql = "INSERT INTO users (" . implode(", ", $fields) . ") 
                    VALUES (" . implode(", ", $placeholders) . ")";
            
            error_log("SQL: $sql");
            error_log("Values: " . json_encode($values));
            
            $stmt = $this->db->prepare($sql);
            
            foreach ($values as $key => $value) {
                $stmt->bindValue($key, $value);
            }
            
            $result = $stmt->execute();
            
            if (!$result) {
                error_log("Database error when creating user: " . json_encode($stmt->errorInfo()));
                throw new Exception("Failed to create user: " . $stmt->errorInfo()[2]);
            }
            
            $id = $this->db->lastInsertId();
            error_log("User created with ID: " . $id);
            
            return $this->getById($id);
        } catch (PDOException $e) {
            error_log("PDO Exception when creating user: " . $e->getMessage());
            throw $e;
        } catch (Exception $e) {
            error_log("Exception when creating user: " . $e->getMessage());
            throw $e;
        }
    }
    
    public function update($id, $data) {
        $sql = "UPDATE users SET 
                    name = COALESCE(:name, name)
                WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':name', $data['name'] ?? null);
        
        $stmt->execute();
        
        return $this->getById($id);
    }
}
