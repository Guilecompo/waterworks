<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $update_date = date('Y-m-d H:i:s');


    $sql = "INSERT INTO property_rate (property_Id, minimum_rate, second_rate, third_rate, last_rate, update_date) ";
    $sql .= "VALUES (:propertyId, :minimum_rate, :second_rate, :third_rate, :last_rate, :updated_date)";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":propertyId", $_POST['propertyId'], PDO::PARAM_INT);
    $stmt->bindParam(":minimum_rate", $_POST['minimum_rate'], PDO::PARAM_INT);
    $stmt->bindParam(":second_rate", $_POST['second_rate'], PDO::PARAM_INT);
    $stmt->bindParam(":third_rate", $_POST['third_rate'], PDO::PARAM_INT);
    $stmt->bindParam(":last_rate", $_POST['last_rate'], PDO::PARAM_INT);
    $stmt->bindParam(":updated_date", $update_date);

    // Execute the prepared statement
    $returnValue = 0;
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $returnValue = 1;
    }

    echo json_encode(['status' => $returnValue, 'message' => 'Record saved successfully']);

}
?>