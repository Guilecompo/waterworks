<?php
  header("Access-Control-Allow-Origin:*");
  include 'connection.php';

  $branchId = $_POST['branchId'];
  $sql = "SELECT * FROM branch WHERE branch_id = :branchId ORDER BY branch_name";
  $stmt = $conn->prepare($sql);
  $stmt->bindParam(":branchId", $branchId);
  $stmt->execute();
  
  $returnValue = $stmt->rowCount() > 0 ? $stmt->fetchAll(PDO::FETCH_ASSOC) : 0;

  echo json_encode($returnValue);
?>
