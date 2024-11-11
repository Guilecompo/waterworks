<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';

try {
    $stmt = $conn->prepare("SELECT
        billing.billing_id,
        billing.total_bill,
        billing.billing_uniqueId,
        billing.reading_date,
        DATE_FORMAT(billing.reading_date,, '%M %d, %Y %h:%i %p') AS reading_date,
        billing.previous_meter,
        billing.present_meter,
        billing.cubic_consumed,
        user_consumer.meter_no,
        user_consumer.firstname, 
        user_consumer.middlename, 
        user_consumer.lastname, 
        branch.branch_name, 
        address_zone.zone_name,
        address_barangay.barangay_name
        FROM `billing` billing 
        INNER JOIN user_consumer ON billing.consumerId = user_consumer.user_id 
        INNER JOIN branch ON user_consumer.branchId = branch.branch_id 
        INNER JOIN address_zone ON branch.locationId = address_zone.zone_id 
        INNER JOIN address_barangay ON address_zone.barangayId = address_barangay.barangay_id
        WHERE billing_statusId = 2
    ");
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($results) > 0) {
        echo json_encode($results);
    } else {
        echo json_encode(["error" => "No data found for the specified criteria"]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}

?>
