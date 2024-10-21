<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

// include 'connection.php';
include '../connection.php';


error_log(print_r($_POST, true)); // Log the received POST data

$date_added = date("Y-m-d");
$rate_id = htmlspecialchars($_POST['rate_id'], ENT_QUOTES, 'UTF-8');
$propertyId = htmlspecialchars($_POST['propertyId'], ENT_QUOTES, 'UTF-8');
$minimum_rate = htmlspecialchars($_POST['minimum_rate'], ENT_QUOTES, 'UTF-8');
$second_rate = htmlspecialchars($_POST['second_rate'], ENT_QUOTES, 'UTF-8');
$third_rate = htmlspecialchars($_POST['third_rate'], ENT_QUOTES, 'UTF-8');
$last_rate = htmlspecialchars($_POST['last_rate'], ENT_QUOTES, 'UTF-8');
$employee_Id = htmlspecialchars($_POST['employee_Id'], ENT_QUOTES, 'UTF-8');

try {
    // Check if property_name already exists
    $checkDuplicateQuery = "SELECT COUNT(*) AS count FROM property_rate WHERE property_Id = :propertyId AND rate_id != :rate_id";
    $checkDuplicateStmt = $conn->prepare($checkDuplicateQuery);
    $checkDuplicateStmt->bindParam(":propertyId", $propertyId, PDO::PARAM_INT);
    $checkDuplicateStmt->bindParam(":rate_id", $rate_id, PDO::PARAM_INT);
    $checkDuplicateStmt->execute();
    $result = $checkDuplicateStmt->fetch(PDO::FETCH_ASSOC);

    if ($result['count'] == 0) {

        $sql = "UPDATE property_rate SET
        property_Id = :propertyId,
        minimum_rate = :minimum_rate,
        second_rate = :second_rate,
        third_rate = :third_rate,
        last_rate = :last_rate,
        WHERE rate_id = :rate_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":rate_id", $rate_id, PDO::PARAM_INT);
        $stmt->bindParam(":propertyId", $propertyId, PDO::PARAM_INT);
        $stmt->bindParam(":minimum_rate", $minimum_rate, PDO::PARAM_STR);
        $stmt->bindParam(":second_rate", $second_rate, PDO::PARAM_STR);
        $stmt->bindParam(":third_rate", $third_rate, PDO::PARAM_STR);
        $stmt->bindParam(":last_rate", $last_rate, PDO::PARAM_STR);
        if ($stmt->execute()) {
            $activity_type = "Edit";
            $table_name = "Rate";
            $sql1 = "INSERT INTO activity_log (activity_type, table_name, date_added, employee_Id) ";
            $sql1 .= "VALUES (:activity_type, :table_name, :date_added, :employee_Id)";

            $stmt1 = $conn->prepare($sql1);
            $stmt1->bindParam(":activity_type", $activity_type, PDO::PARAM_STR);
            $stmt1->bindParam(":table_name", $table_name, PDO::PARAM_STR);
            $stmt1->bindParam(":date_added", $date_added);
            $stmt1->bindParam(":employee_Id", $employee_Id, PDO::PARAM_INT);
            $stmt1->execute();

            echo json_encode(array("status" => 1, "message" => "Property Successfully Updated & Added to Activity Log!"));
        } else {
            echo json_encode(array("status" => 0, "message" => "Failed to Updated Property"));
        }

    } else {
        echo json_encode(array("status" => 0, "message" => "Duplicate entry for property_name"));
    }
} catch (PDOException $e) {
    error_log("Error: " . $e->getMessage());
    echo json_encode(array("status" => 0, "message" => "Connection failed: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>
