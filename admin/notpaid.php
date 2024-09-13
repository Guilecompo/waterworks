<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';

try {
    // Correcting the SQL query (removed the redundant SELECT)
    $stmt = $conn->prepare("
        SELECT billing.billing_id,
               billing.total_bill,
               user_consumer.firstname, 
               user_consumer.middlename, 
               user_consumer.lastname, 
               branch.branch_name, 
               address_zone.zone_name
        FROM billing
        INNER JOIN user_consumer ON billing.consumerId = user_consumer.user_id 
        INNER JOIN branch ON user_consumer.branchId = branch.branch_id 
        INNER JOIN address_zone ON branch.locationId = address_zone.zone_id 
        WHERE billing_statusId = 2
    ");

    // Execute the query
    $stmt->execute();

    // Fetch the results
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check if data exists and return the JSON response
    if (count($results) > 0) {
        echo json_encode($results);
    } else {
        echo json_encode(["error" => "No data found for the specified billing status"]);
    }
} catch (PDOException $e) {
    // Return an error message if the SQL execution fails
    echo json_encode(["error" => $e->getMessage()]);
}
?>
