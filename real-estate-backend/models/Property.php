<?php
require_once __DIR__ . '/../utils/Database.php';
require_once __DIR__ . '/Reservation.php';

class Property {
    private $db;
    private $reservationModel;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
        $this->reservationModel = new Reservation();
    }
    
    // Check if property is available for specified dates
    public function isAvailable($propertyId, $checkInDate, $checkOutDate, $excludeReservationId = null) {
        // First check if the property exists and is available for booking
        $stmt = $this->db->prepare("SELECT status FROM properties WHERE id = :id");
        $stmt->bindValue(':id', $propertyId);
        $stmt->execute();
        
        $property = $stmt->fetch();
        
        if (!$property || $property['status'] !== 'available') {
            return false;
        }
        
        // Then check for overlapping reservations
        return !$this->reservationModel->hasOverlappingReservations(
            $propertyId, 
            $checkInDate, 
            $checkOutDate, 
            $excludeReservationId
        );
    }
    
    public function getAll($page = 1, $perPage = 10, $filters = []) {
        $offset = ($page - 1) * $perPage;
        
        // Base query
        $sql = "SELECT * FROM properties WHERE 1=1";
        $params = [];
        
        // Apply filters
        if (!empty($filters['property_type'])) {
            $sql .= " AND property_type = :property_type";
            $params[':property_type'] = $filters['property_type'];
        }
        
        if (!empty($filters['min_price'])) {
            $sql .= " AND price >= :min_price";
            $params[':min_price'] = $filters['min_price'];
        }
        
        if (!empty($filters['max_price'])) {
            $sql .= " AND price <= :max_price";
            $params[':max_price'] = $filters['max_price'];
        }
        
        if (!empty($filters['bedrooms'])) {
            $sql .= " AND bedrooms >= :bedrooms";
            $params[':bedrooms'] = $filters['bedrooms'];
        }
        
        if (!empty($filters['bathrooms'])) {
            $sql .= " AND bathrooms >= :bathrooms";
            $params[':bathrooms'] = $filters['bathrooms'];
        }
        
        if (!empty($filters['search'])) {
            $sql .= " AND (title LIKE :search OR description LIKE :search)";
            $params[':search'] = "%{$filters['search']}%";
        }
        
        // Get total count for pagination
        $countSql = str_replace("SELECT *", "SELECT COUNT(*) as count", $sql);
        $countStmt = $this->db->prepare($countSql);
        foreach ($params as $key => $value) {
            $countStmt->bindValue($key, $value);
        }
        $countStmt->execute();
        $total = $countStmt->fetch()['count'];
        
        // Get the paginated results
        $sql .= " ORDER BY created_at DESC LIMIT :offset, :limit";
        $stmt = $this->db->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
        $stmt->bindValue(':limit', $perPage, PDO::PARAM_INT);
        $stmt->execute();
        
        $properties = $stmt->fetchAll();
        
        // Convert images from JSON to array
        foreach ($properties as &$property) {
            $property['images'] = json_decode($property['images']);
            $property['features'] = json_decode($property['features']);
        }
        
        return [
            'data' => $properties,
            'total' => $total,
            'current_page' => $page,
            'per_page' => $perPage,
            'last_page' => ceil($total / $perPage)
        ];
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM properties WHERE id = :id");
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        
        $property = $stmt->fetch();
        if ($property) {
            $property['images'] = json_decode($property['images']);
            $property['features'] = json_decode($property['features']);
            
            // Get owner info
            $ownerStmt = $this->db->prepare("SELECT id, name, email, profile_image FROM users WHERE id = :owner_id");
            $ownerStmt->bindValue(':owner_id', $property['owner_id'], PDO::PARAM_INT);
            $ownerStmt->execute();
            $property['owner'] = $ownerStmt->fetch();
        }
        
        return $property;
    }
    
    public function create($data) {
        $sql = "INSERT INTO properties (title, description, price, address, city, state, zip_code, 
                                        bedrooms, bathrooms, area, property_type, status, features, 
                                        owner_id, is_featured, images, rating, reviews_count) 
                VALUES (:title, :description, :price, :address, :city, :state, :zip_code,
                        :bedrooms, :bathrooms, :area, :property_type, :status, :features,
                        :owner_id, :is_featured, :images, :rating, :reviews_count)";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->bindValue(':title', $data['title']);
        $stmt->bindValue(':description', $data['description']);
        $stmt->bindValue(':price', $data['price']);
        $stmt->bindValue(':address', $data['address']);
        $stmt->bindValue(':city', $data['city']);
        $stmt->bindValue(':state', $data['state']);
        $stmt->bindValue(':zip_code', $data['zip_code']);
        $stmt->bindValue(':bedrooms', $data['bedrooms']);
        $stmt->bindValue(':bathrooms', $data['bathrooms']);
        $stmt->bindValue(':area', $data['area']);
        $stmt->bindValue(':property_type', $data['property_type']);
        $stmt->bindValue(':status', $data['status']);
        $stmt->bindValue(':features', json_encode($data['features']));
        $stmt->bindValue(':owner_id', $data['owner_id']);
        $stmt->bindValue(':is_featured', $data['is_featured'] ? 1 : 0);
        $stmt->bindValue(':images', json_encode($data['images']));
        $stmt->bindValue(':rating', $data['rating'] ?? 0);
        $stmt->bindValue(':reviews_count', $data['reviews_count'] ?? 0);
        
        $stmt->execute();
        $id = $this->db->lastInsertId();
        
        return $this->getById($id);
    }
    
    public function update($id, $data) {
        // First get the current property to check ownership
        $property = $this->getById($id);
        if (!$property) {
            return false;
        }
        
        $sql = "UPDATE properties SET 
                    title = COALESCE(:title, title),
                    description = COALESCE(:description, description),
                    price = COALESCE(:price, price),
                    address = COALESCE(:address, address),
                    city = COALESCE(:city, city),
                    state = COALESCE(:state, state),
                    zip_code = COALESCE(:zip_code, zip_code),
                    bedrooms = COALESCE(:bedrooms, bedrooms),
                    bathrooms = COALESCE(:bathrooms, bathrooms),
                    area = COALESCE(:area, area),
                    property_type = COALESCE(:property_type, property_type),
                    status = COALESCE(:status, status),
                    features = COALESCE(:features, features),
                    is_featured = COALESCE(:is_featured, is_featured),
                    images = COALESCE(:images, images)
                WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':title', $data['title'] ?? null);
        $stmt->bindValue(':description', $data['description'] ?? null);
        $stmt->bindValue(':price', $data['price'] ?? null);
        $stmt->bindValue(':address', $data['address'] ?? null);
        $stmt->bindValue(':city', $data['city'] ?? null);
        $stmt->bindValue(':state', $data['state'] ?? null);
        $stmt->bindValue(':zip_code', $data['zip_code'] ?? null);
        $stmt->bindValue(':bedrooms', $data['bedrooms'] ?? null);
        $stmt->bindValue(':bathrooms', $data['bathrooms'] ?? null);
        $stmt->bindValue(':area', $data['area'] ?? null);
        $stmt->bindValue(':property_type', $data['property_type'] ?? null);
        $stmt->bindValue(':status', $data['status'] ?? null);
        $stmt->bindValue(':features', isset($data['features']) ? json_encode($data['features']) : null);
        $stmt->bindValue(':is_featured', isset($data['is_featured']) ? ($data['is_featured'] ? 1 : 0) : null);
        $stmt->bindValue(':images', isset($data['images']) ? json_encode($data['images']) : null);
        
        $stmt->execute();
        
        return $this->getById($id);
    }
    
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM properties WHERE id = :id");
        $stmt->bindValue(':id', $id);
        return $stmt->execute();
    }
    
    public function getFeatured($limit = 6) {
        $stmt = $this->db->prepare("SELECT * FROM properties WHERE is_featured = 1 AND status = 'available' ORDER BY created_at DESC LIMIT :limit");
        $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
        $stmt->execute();
        
        $properties = $stmt->fetchAll();
        
        // Convert images from JSON to array
        foreach ($properties as &$property) {
            $property['images'] = json_decode($property['images']);
            $property['features'] = json_decode($property['features']);
        }
        
        return $properties;
    }
    
    // Add method to check availability (for the API endpoint)
    public function checkAvailability($propertyId, $checkInDate, $checkOutDate) {
        $available = $this->isAvailable($propertyId, $checkInDate, $checkOutDate);
        
        return [
            'available' => $available,
            'property_id' => $propertyId,
            'check_in_date' => $checkInDate,
            'check_out_date' => $checkOutDate
        ];
    }
}
