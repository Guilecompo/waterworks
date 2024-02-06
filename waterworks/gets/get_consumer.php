<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';

// Get the account ID sent from the client
$accId = $_POST['accId'];

$stmt = $conn->prepare("SELECT 
    a.user_id,
    a.firstname, a.middlename,
    a.lastname,a.email, 
    a.phone_no, c.property_name,
    d.zone_name, e.barangay_name,
    f.municipality_name, a.meter_no,
    a.password, g.position_name,
    h.branch_name, i.user_status
FROM
    user_consumer a
INNER JOIN property c ON a.propertyId = c.property_id
INNER JOIN address_zone d ON a.addressId = d.zone_id
INNER JOIN address_barangay e ON d.barangayId = e.barangay_id
INNER JOIN address_municipality f ON e.municipalityId = f.municipality_id
INNER JOIN position g ON a.positionId = g.position_id
INNER JOIN branch h ON a.branchId = h.branch_id
INNER JOIN user_status i ON a.statusId = i.status_id
WHERE a.user_id = :accId
");


$stmt->bindParam(":accId", $accId);
$stmt->execute();

$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (count($results) > 0) {
    // Consumer data found
    echo json_encode($results);
} else {
    // Consumer not found
    echo json_encode(["error" => "Consumer data not found or is invalid"]);
}
?>
