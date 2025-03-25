<?php
require_once __DIR__ . '/../utils/Database.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Property.php';

// Get database connection
$db = Database::getInstance()->getConnection();

try {
    // Create admin user
    $userModel = new User();
    $adminUser = $userModel->getByEmail('admin@example.com');
    
    if (!$adminUser) {
        $adminUser = $userModel->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => 'password123',
            'address' => '123 Admin St',
            'city' => 'Admin City',
            'state' => 'AS',
            'zip_code' => '12345',
            'is_admin' => 1,
            'is_verified' => 1
        ]);
        
        echo "Admin user created: admin@example.com / password123\n";
    } else {
        echo "Admin user already exists\n";
    }
    
    // Create regular user
    $regularUser = $userModel->getByEmail('user@example.com');
    
    if (!$regularUser) {
        $regularUser = $userModel->create([
            'name' => 'Regular User',
            'email' => 'user@example.com',
            'password' => 'password123',
            'address' => '456 User St',
            'city' => 'User City',
            'state' => 'US',
            'zip_code' => '54321',
            'is_admin' => 0,
            'is_verified' => 1
        ]);
        
        echo "Regular user created: user@example.com / password123\n";
    } else {
        echo "Regular user already exists\n";
    }
    
    // Create sample properties
    $propertyModel = new Property();
    
    $sampleProperties = [
        [
            'title' => 'Luxury Apartment in Downtown',
            'description' => 'Beautiful luxury apartment with amazing city views',
            'price' => 500000,
            'property_type' => 'apartment',
            'bedrooms' => 3,
            'bathrooms' => 2,
            'area' => 150,
            'address' => '789 Downtown Blvd',
            'city' => 'New York',
            'state' => 'NY',
            'zip_code' => '10001',
            'images' => ['https://placehold.co/800x600/png'],
            'is_featured' => 1,
            'status' => 'available',
            'features' => ['parking', 'gym', 'pool'],
            'owner_id' => $adminUser['id'],
            'rating' => 4.5,
            'reviews_count' => 10
        ],
        [
            'title' => 'Modern Bungalow with Pool',
            'description' => 'Spacious bungalow with private pool and garden',
            'price' => 750000,
            'property_type' => 'bungalow',
            'bedrooms' => 4,
            'bathrooms' => 3,
            'area' => 200,
            'address' => '101 Suburbs Ave',
            'city' => 'Los Angeles',
            'state' => 'CA',
            'zip_code' => '90001',
            'images' => ['https://placehold.co/800x600/png'],
            'is_featured' => 1,
            'status' => 'available',
            'features' => ['pool', 'garden', 'security'],
            'owner_id' => $adminUser['id'],
            'rating' => 4.8,
            'reviews_count' => 15
        ],
        [
            'title' => 'Cozy Studio Apartment',
            'description' => 'Perfect starter home in a great location',
            'price' => 200000,
            'property_type' => 'apartment',
            'bedrooms' => 1,
            'bathrooms' => 1,
            'area' => 45,
            'address' => '222 City Center',
            'city' => 'Chicago',
            'state' => 'IL',
            'zip_code' => '60601',
            'images' => ['https://placehold.co/800x600/png'],
            'is_featured' => 1,
            'status' => 'available',
            'features' => ['security', 'parking'],
            'owner_id' => $regularUser['id'],
            'rating' => 4.2,
            'reviews_count' => 8
        ]
    ];
    
    // Check for existing properties
    $stmt = $db->prepare("SELECT COUNT(*) as count FROM properties");
    $stmt->execute();
    $count = $stmt->fetch()['count'];
    
    if ($count === 0) {
        foreach ($sampleProperties as $property) {
            $propertyModel->create($property);
        }
        echo "Sample properties created\n";
    } else {
        echo "Properties already exist, skipping seeding\n";
    }
    
    echo "Database seeding completed successfully!";
} catch (PDOException $e) {
    die("Error seeding database: " . $e->getMessage());
}
