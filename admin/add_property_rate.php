<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Sanitize and fetch POST data
    $propertyId = isset($_POST['propertyId']) ? htmlspecialchars($_POST['propertyId']) : 0;
    $minimum_rate = isset($_POST['minimum_rate']) ? htmlspecialchars($_POST['minimum_rate']) : 0;
    $second_rate = isset($_POST['second_rate']) ? htmlspecialchars($_POST['second_rate']) : 0;
    $third_rate = isset($_POST['third_rate']) ? htmlspecialchars($_POST['third_rate']) : 0;
    $last_rate = isset($_POST['last_rate']) ? htmlspecialchars($_POST['last_rate']) : 0;
    $employee_Id = isset($_POST['employee_Id']) ? htmlspecialchars($_POST['employee_Id']) : 0;
    $date_added = date("Y-m-d");
    $rate_statusId = 1;

    // Prepare SQL statement
    $sql = "INSERT INTO property_rate (property_Id, minimum_rate, second_rate, third_rate, last_rate, date_added, employee_Id, rate_statusId) ";
    $sql .= "VALUES (:propertyId, :minimum_rate, :second_rate, :third_rate, :last_rate, :date_added, :employee_Id, :rate_statusId)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":propertyId", $propertyId, PDO::PARAM_INT);
    $stmt->bindParam(":minimum_rate", $minimum_rate, PDO::PARAM_INT);
    $stmt->bindParam(":second_rate", $second_rate, PDO::PARAM_INT);
    $stmt->bindParam(":third_rate", $third_rate, PDO::PARAM_INT);
    $stmt->bindParam(":last_rate", $last_rate, PDO::PARAM_INT);
    $stmt->bindParam(":rate_statusId", $rate_statusId, PDO::PARAM_INT);
    $stmt->bindParam(":date_added", $date_added);
    $stmt->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);

    // Execute the prepared statement
    $returnValue = 0;
    $stmt->execute();

    // Check if insertion was successful
    if ($stmt->rowCount() > 0) {
        $returnValue = 1;
        $activity_type = "Add";
        $table_name = "Rate";
        $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
        $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

        $stmt1 = $conn->prepare($sql1);
        $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
        $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
        $stmt1->bindParam(":date_added", $date_added);
        $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
        $stmt1->execute();

        echo json_encode(array("status" => $returnValue, "message" => "Rate Successfully Added & Added to Activity Log!"));
    } else {
        echo json_encode(array("status" => 0, "message" => "Failed to add Rate"));
    }
}
?>
