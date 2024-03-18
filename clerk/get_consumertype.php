<?php
  header("Access-Control-Allow-Origin:*");
  include 'connection.php';

  $sql = "SELECT * FROM consumer_type WHERE consumertype NOT IN ('Employee') ORDER BY consumertype";
  $stmt = $conn->prepare($sql);
  $stmt->execute();
  
  $returnValue = $stmt->rowCount() > 0 ? $stmt->fetchAll(PDO::FETCH_ASSOC) : 0;

  echo json_encode($returnValue);
?>