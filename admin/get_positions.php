<?php
  header("Access-Control-Allow-Origin:*");
  include 'connection.php';

  $sql = "SELECT * FROM position  WHERE  position_name NOT IN ('consumer') AND position_name NOT IN ('admin')  ORDER BY position_name";
  $stmt = $conn->prepare($sql);
  $stmt->execute();
  
  $returnValue = $stmt->rowCount() > 0 ? $stmt->fetchAll(PDO::FETCH_ASSOC) : 0;

  echo json_encode($returnValue);
?>