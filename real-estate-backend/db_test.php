<?php
// Simple database connection test

require_once __DIR__ . '/utils/Database.php';

header('Content-Type: text/html');
echo "<h1>Database Connection Test</h1>";

try {
    $db = Database::getInstance()->getConnection();
    echo "<p style='color: green;'>✅ Successfully connected to the database!</p>";
    
    // Test querying a table
    try {
        $result = $db->query("SHOW TABLES");
        $tables = $result->fetchAll(PDO::FETCH_COLUMN);
        
        echo "<h2>Database Tables:</h2>";
        if (count($tables) > 0) {
            echo "<ul>";
            foreach ($tables as $table) {
                echo "<li>$table</li>";
            }
            echo "</ul>";
        } else {
            echo "<p>No tables found in the database. You may need to run your schema creation script.</p>";
        }
    } catch (PDOException $e) {
        echo "<p style='color: orange;'>Connected to database but couldn't query tables: " . $e->getMessage() . "</p>";
    }
} catch (Exception $e) {
    echo "<p style='color: red;'>❌ Failed to connect to the database: " . $e->getMessage() . "</p>";
    
    // Show database config
    echo "<h2>Database Configuration:</h2>";
    echo "<pre>";
    $config = require __DIR__ . '/config/database.php';
    echo "Host: " . $config['host'] . "\n";
    echo "Database: " . $config['database'] . "\n";
    echo "Username: " . $config['username'] . "\n";
    echo "Password: " . (empty($config['password']) ? "(empty)" : "(set)") . "\n";
    echo "</pre>";
}
?>

<p>
    <a href="index.php">Back to API</a>
</p>
