<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';

$dateInput = isset($_POST['dateInput']) ? $_POST['dateInput'] : null;

if ($dateInput) {
    $stmt = $conn->prepare("SELECT
        a.pay_id, a.or_num,
        b.firstname AS emp_firstname, b.middlename AS emp_middlename, b.lastname AS emp_lastname,
        c.user_id, c.meter_no,
        c.firstname AS con_firstname, c.middlename AS con_middlename, c.lastname AS con_lastname,
        d.zone_name, e.barangay_name,
        f.municipality_name,
        DATE_FORMAT(a.pay_date, '%M %d, %Y') AS pay_date,
        DATE_FORMAT(a.pay_date, '%Y-%m-%d') AS fileter_date,
        a.pay_amount, a.branchId, a.pay_balance
    FROM payment a
    INNER JOIN user_employee b ON a.pay_employeeId = b.user_id
    INNER JOIN user_consumer c ON a.pay_consumerId = c.user_id
    INNER JOIN address_zone d ON c.addressId = d.zone_id
    INNER JOIN address_barangay e ON d.barangayId = e.barangay_id
    INNER JOIN address_municipality f ON e.municipalityId = f.municipality_id
    WHERE DATE(a.pay_date, '%Y-%m-%d') = :dateInput
    ORDER BY a.or_num");

    $stmt->bindParam(':dateInput', $dateInput);

    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($results) > 0) {
        echo json_encode($results);
    } else {
        echo json_encode(["error" => "No records found for the specified date"]);
    }
} else {
    echo json_encode(["error" => "No date input provided"]);
}
?>
