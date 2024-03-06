<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $date_added = date("Y-m-d");
    $employee_Id = $_POST['employee_Id'];
    $rate_statusId = 1;


    $sql = "INSERT INTO property_rate (property_Id, minimum_rate, second_rate, third_rate, last_rate, date_added, employee_Id, rate_statusId) ";
    $sql .= "VALUES (:propertyId, :minimum_rate, :second_rate, :third_rate, :last_rate, :date_added, :employee_Id, :rate_statusId)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":propertyId", $_POST['propertyId'], PDO::PARAM_INT);
    $stmt->bindParam(":minimum_rate", $_POST['minimum_rate'], PDO::PARAM_INT);
    $stmt->bindParam(":second_rate", $_POST['second_rate'], PDO::PARAM_INT);
    $stmt->bindParam(":third_rate", $_POST['third_rate'], PDO::PARAM_INT);
    $stmt->bindParam(":last_rate", $_POST['last_rate'], PDO::PARAM_INT);
    $stmt->bindParam(":rate_statusId", $rate_statusId, PDO::PARAM_INT);
    $stmt->bindParam(":date_added", $date_added);
    $stmt->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);

    // Execute the prepared statement
    $returnValue = 0;
    $stmt->execute();

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
    }else {
        echo json_encode(array("status" => 0, "message" => "Failed to add Rate"));
    }

}
?>