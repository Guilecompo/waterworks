<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

// include 'connection.php';
include '../connection.php';

error_log(print_r($_POST, true)); // Log the received POST data

// Sanitize POST data
$edit_consumertype = htmlspecialchars($_POST['edit_consumertype'], ENT_QUOTES, 'UTF-8');
$edit_discount = htmlspecialchars($_POST['edit_discount'], ENT_QUOTES, 'UTF-8');
$employee_Id = htmlspecialchars($_POST['employee_Id'], ENT_QUOTES, 'UTF-8');
$date_added = date("Y-m-d");

try {
    $sql = "UPDATE consumer_type SET
        consumertype = :edit_consumertype,
        discount_percent = :edit_discount
        WHERE consumertype_id = :consumertype_id";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":consumertype_id", $_POST['consumertype_id'], PDO::PARAM_INT);
    $stmt->bindParam(":edit_consumertype", $edit_consumertype, PDO::PARAM_STR);
    $stmt->bindParam(":edit_discount", $edit_discount, PDO::PARAM_INT);
    if ($stmt->execute()) {
        $activity_type = "Edit";
        $table_name = "Consumer Type";
        $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
        $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

        $stmt1 = $conn->prepare($sql1);
        $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
        $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
        $stmt1->bindParam(":date_added", $date_added);
        $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
        $stmt1->execute();

        echo json_encode(array("status" => 1, "message" => "Consumer Type Successfully Updated & Added to Activity Log!"));
    } else {
        echo json_encode(array("status" => 0, "message" => "Failed to Updated Consumer Type"));
    }
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
