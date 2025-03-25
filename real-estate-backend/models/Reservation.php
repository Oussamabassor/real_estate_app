<?php
require_once __DIR__ . '/../utils/Database.php';

class Reservation {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function getById($id) {
        $stmt = $this->db->prepare("SELECT * FROM reservations WHERE id = :id");
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        
        return $stmt->fetch();
    }
    
    public function getAllForUser($userId) {
        $stmt = $this->db->prepare("SELECT * FROM reservations WHERE user_id = :user_id ORDER BY created_at DESC");
        $stmt->bindValue(':user_id', $userId);
        $stmt->execute();
        
        return $stmt->fetchAll();
    }
    
    public function create($data) {
        $sql = "INSERT INTO reservations (property_id, user_id, check_in_date, check_out_date, total_price, status, 
                                          payment_method, payment_status, notes) 
                VALUES (:property_id, :user_id, :check_in_date, :check_out_date, :total_price, :status, 
                        :payment_method, :payment_status, :notes)";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->bindValue(':property_id', $data['property_id']);
        $stmt->bindValue(':user_id', $data['user_id']);
        $stmt->bindValue(':check_in_date', $data['check_in_date']);
        $stmt->bindValue(':check_out_date', $data['check_out_date']);
        $stmt->bindValue(':total_price', $data['total_price']);
        $stmt->bindValue(':status', $data['status'] ?? 'pending');
        $stmt->bindValue(':payment_method', $data['payment_method'] ?? null);
        $stmt->bindValue(':payment_status', $data['payment_status'] ?? 'pending');
        $stmt->bindValue(':notes', $data['notes'] ?? null);
        
        $stmt->execute();
        $id = $this->db->lastInsertId();
        
        return $this->getById($id);
    }
    
    public function update($id, $data) {
        $sql = "UPDATE reservations SET 
                    check_in_date = COALESCE(:check_in_date, check_in_date),
                    check_out_date = COALESCE(:check_out_date, check_out_date),
                    total_price = COALESCE(:total_price, total_price),
                    status = COALESCE(:status, status),
                    payment_method = COALESCE(:payment_method, payment_method),
                    payment_status = COALESCE(:payment_status, payment_status),
                    notes = COALESCE(:notes, notes)
                WHERE id = :id";
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':check_in_date', $data['check_in_date'] ?? null);
        $stmt->bindValue(':check_out_date', $data['check_out_date'] ?? null);
        $stmt->bindValue(':total_price', $data['total_price'] ?? null);
        $stmt->bindValue(':status', $data['status'] ?? null);
        $stmt->bindValue(':payment_method', $data['payment_method'] ?? null);
        $stmt->bindValue(':payment_status', $data['payment_status'] ?? null);
        $stmt->bindValue(':notes', $data['notes'] ?? null);
        
        $stmt->execute();
        
        return $this->getById($id);
    }
    
    public function cancel($id) {
        $stmt = $this->db->prepare("UPDATE reservations SET status = 'cancelled' WHERE id = :id");
        $stmt->bindValue(':id', $id);
        
        return $stmt->execute();
    }
    
    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM reservations WHERE id = :id");
        $stmt->bindValue(':id', $id);
        
        return $stmt->execute();
    }
    
    // Check if a property has any overlapping reservations for given dates
    public function hasOverlappingReservations($propertyId, $checkInDate, $checkOutDate, $excludeReservationId = null) {
        $sql = "SELECT COUNT(*) as count FROM reservations 
                WHERE property_id = :property_id 
                AND status != 'cancelled'
                AND (
                    (check_in_date <= :check_in_date AND check_out_date > :check_in_date) OR
                    (check_in_date < :check_out_date AND check_out_date >= :check_out_date) OR
                    (check_in_date >= :check_in_date AND check_out_date <= :check_out_date)
                )";
                
        if ($excludeReservationId) {
            $sql .= " AND id != :exclude_id";
        }
        
        $stmt = $this->db->prepare($sql);
        
        $stmt->bindValue(':property_id', $propertyId);
        $stmt->bindValue(':check_in_date', $checkInDate);
        $stmt->bindValue(':check_out_date', $checkOutDate);
        
        if ($excludeReservationId) {
            $stmt->bindValue(':exclude_id', $excludeReservationId);
        }
        
        $stmt->execute();
        
        return $stmt->fetch()['count'] > 0;
    }
}
