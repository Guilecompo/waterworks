<?php
header("Access-Control-Allow-Origin:*");
include 'connection.php';

$accountId = $_POST['accountId'];

$sql = "SELECT * FROM user_consumer WHERE connected_parentId = :accountId ORDER BY connected_number";
$stmt = $conn->prepare($sql);
$stmt->bindParam(":accountId", $accountId, PDO::PARAM_INT);
$stmt->execute();

$returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (empty($returnValue)) {
    // If the result set is empty, return an alert
    echo json_encode(["message" => "No data found"]);
} else {
    // If the result set is not empty, return the data
    echo json_encode($returnValue);
}
?>
