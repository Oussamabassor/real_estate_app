<?php
// Set content type to plain text for better readability
header('Content-Type: text/plain');

echo "Database Setup Script\n";
echo "====================\n\n";

try {
    // Get database configuration
    $config = [
        'host' => 'localhost',
        'username' => 'root',
        'password' => 'MSFadmin2005.', // Note the period at the end
        'database' => 'real-estate',
        'charset' => 'utf8mb4',
        'port' => 3306
    ];
    
    echo "Database Configuration:\n";
    echo "Host: {$config['host']}\n";
    echo "Database: {$config['database']}\n";
    echo "Username: {$config['username']}\n";
    echo "Password: " . str_repeat('*', strlen($config['password'])) . "\n\n";
    
    // First, try to connect to MySQL without specifying a database
    try {
        echo "Connecting to MySQL server...\n";
        $pdo = new PDO(
            "mysql:host={$config['host']};port={$config['port']}",
            $config['username'],
            $config['password'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        
        echo "✅ Connected to MySQL server successfully.\n\n";
        
        // Check if database exists
        echo "Checking if database exists...\n";
        $stmt = $pdo->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '{$config['database']}'");
        
        if ($stmt->rowCount() === 0) {
            echo "❌ Database '{$config['database']}' does not exist.\n";
            echo "Creating database...\n";
            
            $pdo->exec("CREATE DATABASE `{$config['database']}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            echo "✅ Database '{$config['database']}' created successfully.\n\n";
        } else {
            echo "✅ Database '{$config['database']}' already exists.\n\n";
        }
        
        // Connect to the specific database
        echo "Connecting to the database...\n";
        $pdo->exec("USE `{$config['database']}`");
        echo "✅ Connected to database '{$config['database']}'.\n\n";
        
        // Create tables if they don't exist
        echo "Checking and creating tables if needed...\n";
        
        // Users table
        echo "Creating users table...\n";
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `users` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `name` VARCHAR(255) NOT NULL,
                `email` VARCHAR(255) UNIQUE NOT NULL,
                `password` VARCHAR(255) NOT NULL,
                `role` ENUM('user', 'admin') DEFAULT 'user',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ");
        echo "✅ Users table exists or was created.\n";
        
        // Properties table
        echo "Creating properties table...\n";
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `properties` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `name` VARCHAR(255) NOT NULL,
                `description` TEXT,
                `location` VARCHAR(255),
                `price` DECIMAL(10,2) NOT NULL,
                `type` ENUM('apartment', 'bungalow') NOT NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        ");
        echo "✅ Properties table exists or was created.\n";
        
        // Reservations table
        echo "Creating reservations table...\n";
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `reservations` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `user_id` INT NOT NULL,
                `property_id` INT NOT NULL,
                `check_in` DATE NOT NULL,
                `check_out` DATE NOT NULL,
                `status` ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
                FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON DELETE CASCADE
            )
        ");
        echo "✅ Reservations table exists or was created.\n";
        
        // Payments table
        echo "Creating payments table...\n";
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `payments` (
                `id` INT AUTO_INCREMENT PRIMARY KEY,
                `reservation_id` INT NOT NULL,
                `amount` DECIMAL(10,2) NOT NULL,
                `payment_method` ENUM('cash', 'cheque', 'bank_transfer') NOT NULL,
                `payment_status` ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (`reservation_id`) REFERENCES `reservations`(`id`) ON DELETE CASCADE
            )
        ");
        echo "✅ Payments table exists or was created.\n\n";
        
        // Check if admin user exists
        echo "Checking for admin user...\n";
        $stmt = $pdo->query("SELECT COUNT(*) FROM `users` WHERE `role` = 'admin'");
        $adminCount = $stmt->fetchColumn();
        
        if ($adminCount === 0) {
            echo "Creating admin user...\n";
            
            // Create admin user
            $stmt = $pdo->prepare("
                INSERT INTO `users` (`name`, `email`, `password`, `role`)
                VALUES (:name, :email, :password, 'admin')
            ");
            
            $stmt->execute([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => 'password123' // In production, use password_hash()
            ]);
            
            echo "✅ Admin user created with email: admin@example.com and password: password123\n\n";
        } else {
            echo "✅ Admin user already exists.\n\n";
        }
        
        // Add a regular user for testing
        echo "Checking for test user...\n";
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM `users` WHERE `email` = :email");
        $stmt->execute(['email' => 'user@example.com']);
        $userCount = $stmt->fetchColumn();
        
        if ($userCount === 0) {
            echo "Creating test user...\n";
            
            $stmt = $pdo->prepare("
                INSERT INTO `users` (`name`, `email`, `password`, `role`)
                VALUES (:name, :email, :password, 'user')
            ");
            
            $stmt->execute([
                'name' => 'Test User',
                'email' => 'user@example.com',
                'password' => 'password123'
            ]);
            
            echo "✅ Test user created with email: user@example.com and password: password123\n\n";
        } else {
            echo "✅ Test user already exists.\n\n";
        }
        
        // Display table information
        echo "Database structure:\n";
        $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        
        foreach ($tables as $table) {
            echo "Table: $table\n";
            
            // Get columns
            $columns = $pdo->query("DESCRIBE `$table`")->fetchAll(PDO::FETCH_ASSOC);
            echo "  Columns:\n";
            
            foreach ($columns as $column) {
                echo "    {$column['Field']} - {$column['Type']}";
                if ($column['Key'] === 'PRI') echo " (PRIMARY KEY)";
                if ($column['Null'] === 'NO') echo " NOT NULL";
                echo "\n";
            }
            
            // Count rows
            $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
            echo "  Row count: $count\n\n";
        }
        
        echo "Database setup completed successfully!\n";
        echo "You can now use the system with the following credentials:\n";
        echo "Admin User:\n";
        echo "  Email: admin@example.com\n";
        echo "  Password: password123\n\n";
        echo "Regular User:\n";
        echo "  Email: user@example.com\n";
        echo "  Password: password123\n\n";
        
    } catch (PDOException $e) {
        echo "❌ MySQL connection failed: " . $e->getMessage() . "\n";
        echo "Please check your MySQL credentials and server status.\n";
        echo "Error code: " . $e->getCode() . "\n";
        
        // Common error codes
        if ($e->getCode() === 1045) {
            echo "This is an access denied error. Your username or password might be incorrect.\n";
            echo "Check your password contains the correct characters including any special characters.\n";
        } elseif ($e->getCode() === 2002) {
            echo "This is a connection error. Make sure MySQL server is running and accessible.\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ Setup failed: " . $e->getMessage() . "\n";
}
