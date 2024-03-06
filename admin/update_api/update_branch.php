<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include '../connection.php';

error_log(print_r($_POST, true)); // Log the received POST data

$edit_branch = $_POST['edit_branch'];
$date_added = date("Y-m-d");
$employee_Id = $_POST['employee_Id'];

try {
    // Check if branch_name already exists
    $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM branch WHERE branch_name = :edit_branch";
    $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
    $checkDuplicateStmt->bindParam(":edit_branch", $edit_branch, PDO::PARAM_STR);
    $checkDuplicateStmt->execute();
    $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] == 0) {
        // If branch_name doesn't exist, proceed with the update
        $sql = "UPDATE branch SET
        branch_name = :edit_branch, 
        locationId = :zoneId,
        phone_num = :edit_phone_no
        WHERE branch_id = :branch_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":branch_id", $_POST['branch_id'], PDO::PARAM_INT);
        $stmt->bindParam(":edit_branch", $_POST['edit_branch'], PDO::PARAM_STR);
        $stmt->bindParam(":zoneId", $_POST['zoneId'], PDO::PARAM_INT);
        $stmt->bindParam(":edit_phone_no", $_POST['edit_phone_no'], PDO::PARAM_STR);
        if ($stmt->execute()) {
            $activity_type = "Edit";
            $table_name = "Branch";
            $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
            $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

            $stmt1 = $conn->prepare($sql1);
            $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
            $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
            $stmt1->bindParam(":date_added", $date_added);
            $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
            $stmt1->execute();

            echo json_encode(array("status" => 1, "message" => "Branch Successfully Updated & Added to Activity Log!"));
        } else {
            echo json_encode(array("status" => 0, "message" => "Failed to Updated Branch"));
        }
    } else {
        echo json_encode(array("status" => 0, "message" => "Duplicate entry for branch_name"));
    }
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
