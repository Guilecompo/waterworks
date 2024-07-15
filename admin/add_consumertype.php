<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// 1. Establish connection to the database
include 'connection.php';

// 2. Fetch POST data and sanitize it
$consumertype = isset($_POST['consumertype']) ? htmlspecialchars($_POST['consumertype']) : '';
$discount_percentd = isset($_POST['discount_percentd']) ? htmlspecialchars($_POST['discount_percentd']) : '';
$employee_Id = isset($_POST['employee_Id']) ? intval($_POST['employee_Id']) : 0;
$date_added = date("Y-m-d");
$position_statusId = 1;

// Query to check for duplicate consumer type
$checkDuplicateQuery = "SELECT COUNT(*) AS count FROM consumer_type WHERE consumertype = :consumertype ";
$checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
$checkDuplicateStmt->bindParam(":consumertype", $consumertype, PDO::PARAM_STR);
$checkDuplicateStmt->execute();
$result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

if ($result['count'] > 0) {
    // Consumer type already exists, don't insert the data
    echo json_encode(['status' => 0, 'message' => 'Duplicate Position']);
} else {
    // 3. Define SQL statement for insertion
    $sql = "INSERT INTO consumer_type (consumertype, discount_percent, date_added, employee_Id, consumertype_statusId) ";
    $sql .= "VALUES (:consumertype, :discount_percentd, :date_added, :employee_Id, :position_statusId)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":consumertype", $consumertype, PDO::PARAM_STR);
    $stmt->bindParam(":discount_percentd", $discount_percentd, PDO::PARAM_STR);
    $stmt->bindParam(":position_statusId", $position_statusId, PDO::PARAM_INT);
    $stmt->bindParam(":date_added", $date_added);
    $stmt->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);

    // Execute the prepared statement
    $returnValue = 0;
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $returnValue = 1;
        $activity_type = "Add";
        $table_name = "Consumer Type";
        $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
        $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

        $stmt1 = $conn->prepare($sql1);
        $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
        $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
        $stmt1->bindParam(":date_added", $date_added);
        $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
        $stmt1->execute();

        echo json_encode(array("status" => $returnValue, "message" => "Position Successfully Added & Added to Activity Log!"));
    } else {
        echo json_encode(array("status" => 0, "message" => "Failed to add Position"));
    }
}
?>
