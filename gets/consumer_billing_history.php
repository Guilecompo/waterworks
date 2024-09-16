<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';

if (!$conn) {
    echo json_encode(["error" => "Database connection failed"]);
    exit;
}

    $accId = intval($_POST['accId']);
    
    try {
        $stmt = $conn->prepare("SELECT
            a.billing_id,
            b.firstname AS emp_firstname, b.middlename AS emp_middlename, b.lastname AS emp_lastname,
            c.user_id, c.meter_no,
            c.firstname AS con_firstname, c.middlename AS con_middlename, c.lastname AS con_lastname,
            d.zone_name, e.barangay_name,
            f.municipality_name,
            a.cubic_consumed,
            DATE_FORMAT(a.reading_date, '%M %d, %Y') AS reading_date,
            a.previous_meter,
            a.present_meter,
            a.arrears,
            a.penalty,
            a.bill_amount,
            a.total_bill
        FROM billing a
        INNER JOIN user_employee b ON a.readerId = b.user_id
        INNER JOIN user_consumer c ON a.consumerId = c.user_id
        INNER JOIN address_zone d ON c.addressId = d.zone_id
        INNER JOIN address_barangay e ON d.barangayId = e.barangay_id
        INNER JOIN address_municipality f ON e.municipalityId = f.municipality_id
        WHERE a.consumerId = :accId AND a.total_bill != 0 AND a.billing_statusId = 2 ORDER BY billing_id DESC");

        $stmt->bindParam(":accId", $accId);
        $stmt->execute();
        
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (count($results) > 0) {
            echo json_encode($results);
        } else {
            echo json_encode(["error" => "No billing records found for this user."]);
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
?>
