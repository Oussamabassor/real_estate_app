<?php
require_once __DIR__ . '/../utils/Database.php';
require_once __DIR__ . '/../utils/ApiResponse.php';
require_once __DIR__ . '/../utils/Cors.php';

// Handle CORS
Cors::handleCors();

// Set content type
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo ApiResponse::error('Method not allowed', null, 405);
    exit;
}

try {
    $db = Database::getInstance()->getConnection();
    
    // Get total properties count
    $propertiesStmt = $db->query("SELECT COUNT(*) as count, type FROM properties GROUP BY type");
    $propertiesByType = [];
    $totalProperties = 0;
    
    while ($row = $propertiesStmt->fetch(PDO::FETCH_ASSOC)) {
        $propertiesByType[$row['type']] = (int)$row['count'];
        $totalProperties += (int)$row['count'];
    }
    
    // Get users count
    $usersStmt = $db->query("SELECT COUNT(*) as count FROM users");
    $totalUsers = $usersStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Get reservations count and total revenue
    $reservationsStmt = $db->query("SELECT COUNT(*) as count, IFNULL(SUM(total_price), 0) as revenue FROM reservations");
    $reservationsData = $reservationsStmt->fetch(PDO::FETCH_ASSOC);
    $totalReservations = $reservationsData['count'];
    $totalRevenue = $reservationsData['revenue'];
    
    // Get monthly revenue for the last 6 months
    $monthlyRevenueStmt = $db->query("
        SELECT 
            DATE_FORMAT(created_at, '%b') as month,
            IFNULL(SUM(total_price), 0) as revenue
        FROM reservations
        WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY created_at ASC
    ");
    
    $monthlyRevenue = [];
    while ($row = $monthlyRevenueStmt->fetch(PDO::FETCH_ASSOC)) {
        $monthlyRevenue[$row['month']] = (float)$row['revenue'];
    }
    
    // Get recent activity (last 5 reservations)
    $activityStmt = $db->query("
        SELECT 
            r.id,
            r.property_id,
            r.user_id,
            r.created_at,
            u.name as user_name,
            p.title as property_name
        FROM reservations r
        LEFT JOIN users u ON r.user_id = u.id
        LEFT JOIN properties p ON r.property_id = p.id
        ORDER BY r.created_at DESC
        LIMIT 5
    ");
    
    $recentActivity = [];
    while ($row = $activityStmt->fetch(PDO::FETCH_ASSOC)) {
        $recentActivity[] = [
            'id' => $row['id'],
            'user' => $row['user_name'] ?: 'User #' . $row['user_id'],
            'action' => 'Reserved ' . ($row['property_name'] ?: 'Property #' . $row['property_id']),
            'time' => date('M j, Y', strtotime($row['created_at']))
        ];
    }
    
    // Format response data
    $data = [
        'totalProperties' => $totalProperties,
        'propertiesByType' => $propertiesByType,
        'activeUsers' => (int)$totalUsers,
        'totalReservations' => (int)$totalReservations,
        'totalRevenue' => (float)$totalRevenue,
        'monthlyRevenue' => $monthlyRevenue,
        'recentActivity' => $recentActivity
    ];
    
    echo ApiResponse::success($data);
    
} catch (Exception $e) {
    echo ApiResponse::error('Failed to get statistics: ' . $e->getMessage(), null, 500);
}
