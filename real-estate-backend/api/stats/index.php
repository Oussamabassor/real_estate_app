<?php
// Include CORS headers
require_once '../../includes/cors.php';

// Set content type
header('Content-Type: application/json');

// Handle OPTIONS preflight directly
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Sample stats data - in production you would get this from your database
$stats = [
    'totalProperties' => 152,
    'propertiesSold' => 89,
    'activeListings' => 63,
    'totalAgents' => 15,
    'totalClients' => 248,
    'averagePrice' => 450000,
    'featuredProperties' => 8,
    'newListingsThisMonth' => 12
];

// Send the response
echo json_encode([
    'status' => 'success',
    'data' => $stats
]);
?>
