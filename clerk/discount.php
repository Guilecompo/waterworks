<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

ini_set('display_errors', 1);
error_reporting(E_ALL);

include 'connection.php';

error_log(print_r($_POST, true)); // Log the received POST data
$consumerId = $_POST['consumerId'];
$consumerDiscount = $_POST['consumerDiscount'];

try{

    $discount = $consumerDiscount / 100;

    $sql = "SELECT total_bill FROM billing WHERE consumerId = :consumerId AND billing_statusId = 2 ORDER BY billing_id DESC";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":consumerId", $consumerId);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        $discounted = $row * $discount;
        $newTotalBill = $row - $discount;

        $sqlUpdates = "UPDATE billing SET total_bill = :newTotalBill WHERE consumerId = :consumerId AND billing_statusId = 2 ORDER BY billing_id DESC";
        $stmtUpdates = $conn->prepare($sqlUpdates);
        $stmtUpdates->bindParam(':consumerId', $consumerId, PDO::PARAM_INT);
        $stmtUpdates->bindParam(':newTotalBill', $newTotalBill, PDO::PARAM_STR);
        $stmtUpdates->execute();

        echo json_encode(array("status" => 1, "message" => "Discount Successfully !"));
        
    } else {
        echo json_encode(array("status" => 0, "message" => "No Billing Yet !"));
    }

}catch (PDOException $e) {
    // echo "Connection failed: " . $e->getMessage();
    $conn->rollBack();
    echo "Transaction failed: " . $e->getMessage();
}

?>