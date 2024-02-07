<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';

// Get the account ID sent from the client
$billing_id = $_POST['billing_id'];

$stmt = $conn->prepare("SELECT
        a.billing_id,
        b.firstname AS emp_firstname, b.middlename AS emp_middlename, b.lastname AS emp_lastname,
        c.user_id, c.meter_no,
        c.firstname AS con_firstname, c.middlename AS con_middlename, c.lastname AS con_lastname,
        d.zone_name, e.barangay_name,
        f.municipality_name,
        a.cubic_consumed,
        DATE_FORMAT(a.reading_date, '%m-%d') AS reading_date,
        DATE_FORMAT(a.due_date, '%m-%d') AS due_date,
        DATE_FORMAT(DATE_ADD(a.due_date, INTERVAL 20 DAY), '%m-%d') AS formatted_reading_date1,
        DATE_FORMAT(a.reading_date, '%M %Y') AS formatted_reading_date2,
        a.previous_meter,
        a.present_meter,
        a.arrears,
        a.penalty,
        a.bill_amount,
        a.total_bill,
        u.update_status_name, a.billing_update_statusId
    FROM billing a
    INNER JOIN user_employee b ON a.readerId = b.user_id
    INNER JOIN user_consumer c ON a.consumerId = c.user_id
    INNER JOIN address_zone d ON c.addressId = d.zone_id
    INNER JOIN address_barangay e ON d.barangayId = e.barangay_id
    INNER JOIN address_municipality f ON e.municipalityId = f.municipality_id
    INNER JOIN update_status u ON a.billing_update_statusId = u.update_status_id
    WHERE a.billing_id = :billing_id ORDER BY billing_id DESC LIMIT 1");

$stmt->bindParam(":billing_id", $billing_id);
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
