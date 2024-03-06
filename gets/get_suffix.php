<?php
header("Access-Control-Allow-Origin: *");
include 'connection.php';

try {
    // Prepare SQL query
    $sql = "SELECT * FROM suffix ORDER BY suffix_id";
    $stmt = $conn->prepare($sql);
    
    // Execute query
    $stmt->execute();
    
    // Fetch data
    $suffixData = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Check if there are any rows returned
    if ($suffixData) {
        // Data found, encode and return
        echo json_encode($suffixData);
    } else {
        // No data found
        echo json_encode([]);
    }
} catch (PDOException $e) {
    // Handle database error
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
