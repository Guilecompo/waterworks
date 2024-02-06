<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';

// Ensure that the 'accId' parameter is set and is a valid integer.
if (isset($_POST['accId']) && is_numeric($_POST['accId'])) {
    $accId = intval($_POST['accId']);
    $stmt = $conn->prepare("SELECT
    a.billing_id,
    b.firstname AS emp_firstname, b.middlename AS emp_middlename, b.lastname AS emp_lastname,
    c.user_id, c.meter_no, c.phone_no,
    c.firstname AS con_firstname, c.middlename AS con_middlename, c.lastname AS con_lastname,
    d.zone_name, e.barangay_name,
    f.municipality_name,
    a.cubic_consumed,
    a.reading_date,
    a.previous_meter,
    a.present_meter,
    a.arrears,
    a.penalty,
    a.total_bill
FROM billing a
INNER JOIN user_employee b ON a.readerId = b.user_id
INNER JOIN user_consumer c ON a.consumerId = c.user_id
INNER JOIN address_zone d ON c.addressId = d.zone_id
INNER JOIN address_barangay e ON d.barangayId = e.barangay_id
INNER JOIN address_municipality f ON e.municipalityId = f.municipality_id
WHERE c.user_id = :accId
-- AND a.reading_date = (
--     SELECT MAX(reading_date)
--     FROM billing
--     WHERE consumerId = c.user_id
-- )
AND billing_statusId = 2
ORDER BY billing_id DESC LIMIT 1");

    $stmt->bindParam(":accId", $accId);
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($results) > 0) {
        // Consumer data found
        echo json_encode($results);
    } else {
        // Consumer not found
        echo json_encode(["error" => "No billing records found for this user."]);
    }
} else {
    // Invalid 'accId' parameter
    echo json_encode(["error" => "Invalid or missing account ID parameter."]);
}
?>
