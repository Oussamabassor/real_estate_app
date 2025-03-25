<?php
require_once __DIR__ . '/../utils/ApiResponse.php';
require_once __DIR__ . '/../utils/Cors.php';

// Handle CORS
Cors::handleCors();

// Set content type
header('Content-Type: application/json');

// Stats data (mock data for now)
$stats = [
    'properties' => 150,
    'clients' => 48,
    'cities' => 12,
    'agents' => 24
];

// Return response
echo ApiResponse::success($stats);
exit;
