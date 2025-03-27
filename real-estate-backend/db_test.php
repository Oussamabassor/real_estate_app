<?php
// Enable error reporting
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Set content type to JSON
header('Content-Type: application/json');

// Define the test function
function testDatabaseConnection() {
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
        
        // Validate config
        if (!isset($config['host']) || !isset($config['username']) || !isset($config['database'])) {
            return [
                'success' => false,
                'message' => 'Database configuration incomplete',
                'config_keys' => array_keys($config)
            ];
        }
        
        // Try to connect
        $dsn = "mysql:host={$config['host']};dbname={$config['database']}";
        $pdo = new PDO($dsn, $config['username'], $config['password'] ?? '');
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        // Run a test query
        $stmt = $pdo->query('SELECT 1 as test');
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Attempt to check if users table exists
        $tables = [];
        $stmt = $pdo->query("SHOW TABLES");
        while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
            $tables[] = $row[0];
        }
        
        $hasUsersTable = in_array('users', $tables);
        
        return [
            'success' => true,
            'message' => 'Database connection successful',
            'test_query_result' => $result,
            'database_name' => $config['database'],
            'tables' => $tables,
            'has_users_table' => $hasUsersTable
        ];
        
    } catch (PDOException $e) {
        return [
            'success' => false,
            'message' => 'Database connection failed',
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

// Run the test and output the result
$result = testDatabaseConnection();
echo json_encode($result, JSON_PRETTY_PRINT);
?>
