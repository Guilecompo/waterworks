<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');

include 'connection.php'; // Ensure your connection.php correctly establishes a PDO connection

// Retrieve query parameters with default values
$billingStatus = isset($_POST['billingStatus']) ? $_POST['billingStatus'] : null;
$branchName = isset($_POST['branch']) ? $_POST['branch'] : null;

try {
    // Base SQL query
    $query = "
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
        WHERE billing_statusId = :billingStatus
    ";
    
    // Append branch filter if provided
    if ($branchName) {
        $query .= " AND branch.branch_name = :branchName";
    }

    // Prepare and execute the statement
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':billingStatus', $billingStatus, PDO::PARAM_INT);
    
    if ($branchName) {
        $stmt->bindParam(':branchName', $branchName, PDO::PARAM_STR);
    }
    
    $stmt->execute();

    // Fetch the results
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Check if data exists and return the JSON response
    if (count($results) > 0) {
        echo json_encode($results);
    } else {
        echo json_encode(["error" => "No data found for the specified criteria"]);
    }
} catch (PDOException $e) {
    // Return an error message if the SQL execution fails
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
