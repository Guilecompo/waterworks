<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. Establish connection to the database
include 'connection.php';

// 2. Check for duplicate property name
$add_property = htmlspecialchars($_POST['add_property'], ENT_QUOTES, 'UTF-8');
$date_added = date("Y-m-d");
$employee_Id = htmlspecialchars($_POST['employee_Id'], ENT_QUOTES, 'UTF-8');
$property_statusId = 1;

// Query to check for duplicate property name
$checkDuplicateQuery = "SELECT COUNT(*) AS count FROM property WHERE property_name = :add_property ";
$checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
$checkDuplicateStmt->bindParam(":add_property", $add_property, PDO::PARAM_STR);
$checkDuplicateStmt->execute();
$result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

if ($result['count'] > 0) {
    // Property name already exists, don't insert the data
    echo json_encode(['status' => 0, 'message' => 'Duplicate Property']);
} else {
    // 3. Define SQL statement for insertion
    $sql = "INSERT INTO property (property_name, date_added, employee_Id, property_statusId) ";
    $sql .= "VALUES (:add_property, :date_added, :employee_Id, :property_statusId)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":add_property", $add_property, PDO::PARAM_STR);
    $stmt->bindParam(":property_statusId", $property_statusId, PDO::PARAM_INT);
    $stmt->bindParam(":date_added", $date_added);
    $stmt->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);

    // Execute the prepared statement
    $returnValue = 0;
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $returnValue = 1;
        $activity_type = "Add";
        $table_name = "Property";
        $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
        $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

        $stmt1 = $conn->prepare($sql1);
        $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
        $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
        $stmt1->bindParam(":date_added", $date_added);
        $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
        $stmt1->execute();

        echo json_encode(array("status" => $returnValue, "message" => "Property Successfully Added & Added to Activity Log!"));
    } else {
        echo json_encode(array("status" => 0, "message" => "Failed to add Property"));
    }
}
?>
