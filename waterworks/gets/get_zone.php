<?php
  header("Access-Control-Allow-Origin:*");
  include 'connection.php';

  $barangayId = $_POST['barangayId'];
  $sql = "SELECT zone_id, zone_name, barangayId FROM address_zone WHERE barangayId = :barangayId  ORDER BY zone_name";
  $stmt = $conn->prepare($sql);
  $stmt->bindParam(":barangayId", $barangayId);
  $stmt->execute();
  
  $returnValue = $stmt->rowCount() > 0 ? $stmt->fetchAll(PDO::FETCH_ASSOC) : 0;

  echo json_encode($returnValue);
?>