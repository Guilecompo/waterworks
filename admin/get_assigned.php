<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';

$stmt = $conn->prepare("SELECT 
    a.assign_id, b.firstname, 
    b.middlename, b.lastname,
    c.zone_id, c.zone_name, 
    d.barangay_id, d.barangay_name,
    e.municipality_id, e.municipality_name,
    f.position_name, g.branch_name
FROM
assign a
INNER JOIN user_employee b ON a.emp_Id = b.user_id
INNER JOIN address_zone c ON a.zone_Id = c.zone_id
INNER JOIN address_barangay d ON c.barangayId = d.barangay_id
INNER JOIN address_municipality e ON d.municipalityId = e.municipality_id
INNER JOIN position f ON b.positionId = f.position_id
INNER JOIN branch g ON a.branchId = g.branch_id
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
