<?php
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../utils/Database.php';
require_once __DIR__ . '/../../utils/ApiResponse.php';
require_once __DIR__ . '/../../models/Property.php';

// Include the CORS handling
require_once '../../includes/cors.php';

header('Content-Type: application/json');

// Set cache control headers for better client-side caching
header('Cache-Control: private, max-age=300'); // 5 minutes cache
header('ETag: ' . md5_file(__FILE__));

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get query parameters with defaults
        $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $perPage = isset($_GET['per_page']) ? (int)$_GET['per_page'] : 10;
        $perPage = min($perPage, 50); // Limit max items per page
        
        // Calculate offset
        $offset = ($page - 1) * $perPage;
        
        // Build base query
        $query = "SELECT SQL_CALC_FOUND_ROWS * FROM properties WHERE 1=1";
        $params = [];
        $types = "";
        
        // Add filters if present
        if (!empty($_GET['type'])) {
            $query .= " AND type = ?";
            $params[] = $_GET['type'];
            $types .= "s";
        }
        
        if (!empty($_GET['min_price'])) {
            $query .= " AND price >= ?";
            $params[] = $_GET['min_price'];
            $types .= "d";
        }
        
        if (!empty($_GET['max_price'])) {
            $query .= " AND price <= ?";
            $params[] = $_GET['max_price'];
            $types .= "d";
        }
        
        // Add pagination
        $query .= " LIMIT ? OFFSET ?";
        $params[] = $perPage;
        $params[] = $offset;
        $types .= "ii";
        
        // Prepare and execute the query
        $stmt = $conn->prepare($query);
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Get total count
        $totalResult = $conn->query("SELECT FOUND_ROWS() as total");
        $total = $totalResult->fetch_assoc()['total'];
        
        // Format response
        $properties = [];
        while ($row = $result->fetch_assoc()) {
            $properties[] = $row;
        }
        
        $response = [
            'status' => 'success',
            'data' => [
                'data' => $properties,
                'total' => (int)$total,
                'per_page' => (int)$perPage,
                'current_page' => (int)$page,
                'last_page' => ceil($total / $perPage)
            ]
        ];
        
        ApiResponse::send($response);
        
    } else {
        throw new Exception("Method not allowed");
    }
    
} catch (Exception $e) {
    ApiResponse::error($e->getMessage(), 500);
}
?>
