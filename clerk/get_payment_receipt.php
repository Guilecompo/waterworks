<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';



// Ensure that the 'accId' parameter is set and is a valid integer.
if (isset($_POST['accId']) && is_numeric($_POST['accId'])) {
    $accId = intval($_POST['accId']);
    $stmt = $conn->prepare("SELECT
        a.pay_id, a.pay_change, a.payment_uniqueId, a.or_num,
        DATE_FORMAT(a.or_date, '%m-%d-%Y') AS or_date,
        b.firstname AS emp_firstname, b.middlename AS emp_middlename, b.lastname AS emp_lastname,
        c.user_id, c.meter_no,
        c.firstname AS con_firstname, c.middlename AS con_middlename, c.lastname AS con_lastname,
        d.zone_name, e.barangay_name,
        f.municipality_name,
        DATE_FORMAT(a.pay_date, '%M %d, %Y') AS pay_date,
        a.pay_amount, a.branchId, a.pay_balance
        
    FROM payment a
    INNER JOIN user_employee b ON a.pay_employeeId = b.user_id
    INNER JOIN user_consumer c ON a.pay_consumerId = c.user_id
    INNER JOIN address_zone d ON c.addressId = d.zone_id
    INNER JOIN address_barangay e ON d.barangayId = e.barangay_id
    INNER JOIN address_municipality f ON e.municipalityId = f.municipality_id
    WHERE a.pay_consumerId = :accId AND b.positionId = 3
    ORDER BY a.pay_id DESC
    ");

    $stmt->bindParam(":accId", $accId);
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($results) > 0) {
        // Loop through the results and replace undefined values with "No Balance"
        foreach ($results as &$result) {
            foreach ($result as $key => $value) {
                if ($value === null) {
                    $result[$key] = "No Balance";
                }
            }
        }

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
