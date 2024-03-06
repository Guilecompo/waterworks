<?php
header("Access-Control-Allow-Origin: *");

include 'connection.php';

try {
    // Prepare and execute the SQL query
    $sql = "SELECT * FROM branch ORDER BY branch_id";
    $stmt = $conn->prepare($sql);
    $stmt->execute();

    // Check if any rows were returned
    if ($stmt->rowCount() > 0) {
        // Fetch all rows and return as JSON
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($returnValue);
    } else {
        // No rows found
        echo json_encode([]);
    }
} catch (PDOException $e) {
    // Handle database errors
    http_response_code(500); // Internal Server Error
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
