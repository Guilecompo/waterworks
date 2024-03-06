<?php
  header("Access-Control-Allow-Origin:*");
  include 'connection.php';

  $sql = "SELECT * FROM branch ORDER BY branch_id";
  $stmt = $conn->prepare($sql);
  $stmt->execute();
  
  $returnValue = $stmt->rowCount() > 0 ? $stmt->fetchAll(PDO::FETCH_ASSOC) : 0;

  echo json_encode($returnValue);
?>
