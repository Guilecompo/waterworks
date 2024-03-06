<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include '../connection.php';

error_log(print_r($_POST, true)); 

try {

    $statusId = 2;
    $date_added = date("Y-m-d");
    $employee_Id = $_POST['employee_Id'];

    $sqlUpdates = "UPDATE user_consumer SET billing_status = :statusId ";
    $stmtUpdates = $conn->prepare($sqlUpdates);
    $stmtUpdates->bindParam(':statusId', $statusId, PDO::PARAM_INT);
    if ($stmtUpdates->execute()) {
        $activity_type = "Update All";
        $table_name = "Consumer Bill Status";
        $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
        $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

        $stmt1 = $conn->prepare($sql1);
        $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
        $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
        $stmt1->bindParam(":date_added", $date_added);
        $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
        $stmt1->execute();

        echo json_encode(array("status" => 1, "message" => "Consumer Successfully Updated & Added to Activity Log!"));
    } else {
        echo json_encode(array("status" => 0, "message" => "Failed to Updated Consumer"));
    }
} catch (PDOException $e) {
    error_log("Error Code: " . $e->getCode() . ", Message: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}
$conn = null;
?>