<?php

class Database {
    private static $instance = null;
    private $connection;
    
    private function __construct() {
        $config = require_once __DIR__ . '/../config/database.php';
        
        try {
            // Log connection attempt
            error_log("Attempting to connect to database: {$config['database']} on {$config['host']}");
            
            $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']};port={$config['port']}";
            
            $this->connection = new PDO(
                $dsn,
                $config['username'],
                $config['password'],
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
            
            error_log("Successfully connected to database");
            
            // Check if required tables exist
            $this->validateSchema();
            
        } catch (PDOException $e) {
            // Log detailed error information
            error_log("Database connection failed: " . $e->getMessage());
            error_log("Connection details: Host={$config['host']}, DB={$config['database']}, User={$config['username']}");
            
            // Attempt to connect without database to see if it exists
            try {
                $pdo = new PDO(
                    "mysql:host={$config['host']};charset={$config['charset']};port={$config['port']}",
                    $config['username'],
                    $config['password']
                );
                
                // Check if database exists
                $stmt = $pdo->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '{$config['database']}'");
                if ($stmt->rowCount() === 0) {
                    error_log("Database '{$config['database']}' does not exist!");
                    die("Database '{$config['database']}' does not exist. Please create it first.");
                }
                
                error_log("Database exists but connection failed. Check permissions or tables.");
                die("Connection to database server succeeded but database access failed: " . $e->getMessage());
                
            } catch (PDOException $innerException) {
                error_log("Cannot connect to MySQL server: " . $innerException->getMessage());
                die("MySQL server connection failed. Check your credentials and server status.");
            }
        }
    }
    
    /**
     * Validate that the required tables exist in the database
     */
    private function validateSchema() {
        try {
            // Check if users table exists
            $result = $this->connection->query("SHOW TABLES LIKE 'users'");
            if ($result->rowCount() === 0) {
                error_log("WARNING: 'users' table does not exist in the database");
            } else {
                // Check columns in users table
                $columns = $this->connection->query("DESCRIBE users")->fetchAll(PDO::FETCH_COLUMN);
                error_log("Users table columns: " . implode(", ", $columns));
            }
            
            // Check other important tables
            $tables = ['properties', 'reservations', 'payments'];
            foreach ($tables as $table) {
                $result = $this->connection->query("SHOW TABLES LIKE '$table'");
                if ($result->rowCount() === 0) {
                    error_log("WARNING: '$table' table does not exist in the database");
                }
            }
            
        } catch (PDOException $e) {
            error_log("Schema validation error: " . $e->getMessage());
        }
    }
    
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function getConnection() {
        return $this->connection;
    }
}
