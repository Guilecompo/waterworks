<?php
  header("Access-Control-Allow-Origin:*");
  include 'connection.php';

  $municipalityId = $_POST['municipalityId'];
  $barangayId = $_POST['barangayId'];
  $sql = "SELECT * FROM address_barangay WHERE municipalityId = :municipalityId AND barangay_id = :barangayId ORDER BY barangay_name";
  $stmt = $conn->prepare($sql);
  $stmt->bindParam(":municipalityId", $municipalityId);
  $stmt->bindParam(":barangayId", $barangayId);
  
  $stmt->execute();
  
  $returnValue = $stmt->rowCount() > 0 ? $stmt->fetchAll(PDO::FETCH_ASSOC) : 0;

  echo json_encode($returnValue);
?>