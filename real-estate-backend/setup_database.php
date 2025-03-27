<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set content type to JSON
header('Content-Type: application/json');

// Define the setup function
function setupDatabase() {
    try {
        // Check if config file exists
        $configFile = __DIR__ . '/config/database.php';
        if (!file_exists($configFile)) {
            return [
                'success' => false,
                'message' => 'Database configuration file not found',
                'path_checked' => $configFile
            ];
        }
        
        // Load configuration
        $config = require($configFile);
        
        // Create PDO connection without selecting database
        $pdo = new PDO("mysql:host={$config['host']}", $config['username'], $config['password'] ?? '');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Check if database exists, create if not
        $databaseName = $config['database'];
        $stmt = $pdo->query("SHOW DATABASES LIKE '{$databaseName}'");
        $databaseExists = $stmt->rowCount() > 0;
        
        if (!$databaseExists) {
            // Create database
            $pdo->exec("CREATE DATABASE `{$databaseName}` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
            $databaseCreated = true;
        } else {
            $databaseCreated = false;
        }
        
        // Switch to the database
        $pdo->exec("USE `{$databaseName}`");
        
        // Check if users table exists, create if not
        $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
        $usersTableExists = $stmt->rowCount() > 0;
        
        if (!$usersTableExists) {
            // Create users table
            $pdo->exec("
                CREATE TABLE `users` (
                  `id` int(11) NOT NULL AUTO_INCREMENT,
                  `name` varchar(255) NOT NULL,
                  `email` varchar(255) NOT NULL,
                  `password` varchar(255) NOT NULL,
                  `role` enum('user','admin') NOT NULL DEFAULT 'user',
                  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                  PRIMARY KEY (`id`),
                  UNIQUE KEY `email` (`email`)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            ");
            
            // Insert demo users (password: password123)
            $hashedPassword = password_hash('password123', PASSWORD_DEFAULT);
            $stmt = $pdo->prepare("
                INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
                ('Admin User', 'admin@example.com', :password, 'admin'),
                ('Demo User', 'user@example.com', :password, 'user')
            ");
            $stmt->bindParam(':password', $hashedPassword);
            $stmt->execute();
            
            $usersTableCreated = true;
        } else {
            $usersTableCreated = false;
        }
        
        return [
            'success' => true,
            'message' => 'Database setup completed successfully',
            'database' => [
                'name' => $databaseName,
                'created' => $databaseCreated,
                'existed' => $databaseExists
            ],
            'users_table' => [
                'created' => $usersTableCreated,
                'existed' => $usersTableExists
            ]
        ];
        
    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Database setup failed',
            'error' => $e->getMessage()
        ];
    } catch (Exception $e) {
        return [
            'success' => false,
            'message' => 'General error',
            'error' => $e->getMessage()
        ];
    }
}

// Run the setup and output the result
$result = setupDatabase();
echo json_encode($result, JSON_PRETTY_PRINT);
?>
