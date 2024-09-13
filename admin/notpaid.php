<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';


    $stmt = $conn->prepare("SELECT
        SELECT billing.billing_id,
        billing.total_bill,
        user_consumer.firstname, 
        user_consumer.middlename, 
        user_consumer.lastname, 
        branch.branch_name, 
        address_zone.zone_name
        FROM `billing` billing 
        INNER JOIN user_consumer ON billing.consumerId = user_consumer.user_id 
        INNER JOIN branch ON user_consumer.branchId = branch.branch_id 
        INNER JOIN address_zone ON branch.locationId = address_zone.zone_id 
        WHERE billing_statusId = 2
    ");

    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($results) > 0) {
        // Consumer data found
        echo json_encode($results);
    } else {
        // Consumer not found
        echo json_encode(["error" => "Reader data not found or is invalid"]);
    }
?>
