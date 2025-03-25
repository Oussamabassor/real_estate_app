<?php
// Set content type to plain text for better readability
header('Content-Type: text/plain');

echo "Database Connection Test\n";
echo "=======================\n\n";

// Database configuration - hard-coded for direct testing
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

try {
    echo "Attempting to connect to MySQL...\n";
    
    $dsn = "mysql:host={$config['host']};port={$config['port']}";
    $pdo = new PDO($dsn, $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
    
    echo "✅ Connected to MySQL server successfully.\n\n";
    
    // Check if database exists
    echo "Checking if database exists...\n";
    $stmt = $pdo->query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '{$config['database']}'");
    
    if ($stmt->rowCount() === 0) {
        echo "❌ Database '{$config['database']}' does not exist.\n";
        echo "Visit /setup_database.php to create it.\n";
    } else {
        echo "✅ Database '{$config['database']}' exists.\n\n";
        
        // Connect to database
        echo "Connecting to the database...\n";
        $pdo = new PDO(
            "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']};port={$config['port']}",
            $config['username'],
            $config['password'],
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        
        echo "✅ Connected to the database successfully.\n\n";
        
        // Check tables
        echo "Tables in database:\n";
        $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        
        if (empty($tables)) {
            echo "No tables found in the database.\n";
            echo "Visit /setup_database.php to create tables.\n";
        } else {
            foreach ($tables as $table) {
                echo "- $table\n";
                $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
                echo "  Row count: $count\n";
            }
        }
    }
} catch (PDOException $e) {
    echo "❌ Database connection error: " . $e->getMessage() . "\n";
    echo "Error code: " . $e->getCode() . "\n\n";
    
    if ($e->getCode() === 1045) {
        echo "This is an access denied error. Your username or password is incorrect.\n";
        echo "Current password: " . $config['password'] . "\n";
        echo "Double-check that the password includes any periods or special characters.\n";
    } elseif ($e->getCode() === 2002) {
        echo "This is a connection error. Make sure MySQL server is running and accessible.\n";
    }
}

echo "\nTest completed at " . date('Y-m-d H:i:s');
