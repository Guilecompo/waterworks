<?php
session_start();

unset($_SESSION['accountId']);
// Redirect to the login page or any other page after logout
header('Location: /waterworks/');
exit;
?>