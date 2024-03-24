<?php
  header("Access-Control-Allow-Origin:*");
  include 'connection.php';

  $accountId = $_POST['accountId'];

  $sql = "SELECT * FROM user_consumer WHERE connected_parentId = :accountId ORDER BY connected_number";
  $stmt = $conn->prepare($sql);
  $stmt->bindParam(":accountId", $accountId, PDO::PARAM_INT);
  $stmt->execute();
  
  $returnValue = $stmt->rowCount() > 0 ? $stmt->fetchAll(PDO::FETCH_ASSOC) : 0;

  echo json_encode($returnValue);
?>
