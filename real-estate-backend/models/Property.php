<?php
require_once __DIR__ . '/../utils/Database.php';
require_once __DIR__ . '/Reservation.php';

class Property {
    private $conn;
    private $table = 'properties';

    public $id;
    public $name;
    public $description;
    public $location;
    public $price;
    public $type;
    public $created_at;
    public $updated_at;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Get all properties with optional filters
    public function getAll($filters = []) {
        $query = "SELECT * FROM " . $this->table;
        
        // Add where clause if filters exist
        if (!empty($filters)) {
            $whereClauses = [];
            if (isset($filters['type']) && $filters['type'] !== 'all') {
                $whereClauses[] = "type = :type";
            }
            if (isset($filters['min_price'])) {
                $whereClauses[] = "price >= :min_price";
            }
            if (isset($filters['max_price'])) {
                $whereClauses[] = "price <= :max_price";
            }
            if (isset($filters['search'])) {
                $whereClauses[] = "(name LIKE :search OR description LIKE :search OR location LIKE :search)";
            }
            
            if (!empty($whereClauses)) {
                $query .= " WHERE " . implode(" AND ", $whereClauses);
            }
        }
        
        $query .= " ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);

        // Bind values if filters exist
        if (!empty($filters)) {
            if (isset($filters['type']) && $filters['type'] !== 'all') {
                $stmt->bindValue(':type', $filters['type']);
            }
            if (isset($filters['min_price'])) {
                $stmt->bindValue(':min_price', $filters['min_price']);
            }
            if (isset($filters['max_price'])) {
                $stmt->bindValue(':max_price', $filters['max_price']);
            }
            if (isset($filters['search'])) {
                $search = "%" . $filters['search'] . "%";
                $stmt->bindValue(':search', $search);
            }
        }

        $stmt->execute();
        return $stmt;
    }

    // Get single property
    public function getSingle() {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $this->id);
        $stmt->execute();
        
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($row) {
            $this->name = $row['name'];
            $this->description = $row['description'];
            $this->location = $row['location'];
            $this->price = $row['price'];
            $this->type = $row['type'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];
            return true;
        }
        return false;
    }

    // Create property
    public function create() {
        $query = "INSERT INTO " . $this->table . "
            (name, description, location, price, type)
            VALUES (:name, :description, :location, :price, :type)";
        
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->price = floatval($this->price);
        $this->type = htmlspecialchars(strip_tags($this->type));
        
        // Bind values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':location', $this->location);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':type', $this->type);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Update property
    public function update() {
        $query = "UPDATE " . $this->table . "
            SET
                name = :name,
                description = :description,
                location = :location,
                price = :price,
                type = :type
            WHERE id = :id";
        
        $stmt = $this->conn->prepare($query);
        
        // Sanitize inputs
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->location = htmlspecialchars(strip_tags($this->location));
        $this->price = floatval($this->price);
        $this->type = htmlspecialchars(strip_tags($this->type));
        $this->id = intval($this->id);
        
        // Bind values
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':location', $this->location);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':type', $this->type);
        $stmt->bindParam(':id', $this->id);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    // Delete property
    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        
        $this->id = intval($this->id);
        $stmt->bindParam(':id', $this->id);
        
        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
