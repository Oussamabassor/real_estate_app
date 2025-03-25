<?php
require_once __DIR__ . '/../../utils/ApiResponse.php';
require_once __DIR__ . '/../../utils/Cors.php';
require_once __DIR__ . '/../../models/Property.php';

// Handle CORS
Cors::handleCors();

// Set content type
header('Content-Type: application/json');

// Mock featured properties for now
$featuredProperties = [
    [
        'id' => 1,
        'title' => 'Luxury Apartment in Downtown',
        'description' => 'Beautiful luxury apartment with amazing city views',
        'price' => 500000,
        'property_type' => 'apartment',
        'bedrooms' => 3,
        'bathrooms' => 2,
        'area' => 150,
        'images' => ['https://placehold.co/800x600/png'],
        'location' => 'New York, NY',
        'status' => 'available'
    ],
    [
        'id' => 2,
        'title' => 'Modern Bungalow with Pool',
        'description' => 'Spacious bungalow with private pool and garden',
        'price' => 750000,
        'property_type' => 'bungalow',
        'bedrooms' => 4,
        'bathrooms' => 3,
        'area' => 200,
        'images' => ['https://placehold.co/800x600/png'],
        'location' => 'Los Angeles, CA',
        'status' => 'available'
    ],
    [
        'id' => 3,
        'title' => 'Cozy Studio Apartment',
        'description' => 'Perfect starter home in a great location',
        'price' => 200000,
        'property_type' => 'apartment',
        'bedrooms' => 1,
        'bathrooms' => 1,
        'area' => 45,
        'images' => ['https://placehold.co/800x600/png'],
        'location' => 'Chicago, IL',
        'status' => 'available'
    ]
];

// Return response
echo ApiResponse::success($featuredProperties);
exit;
