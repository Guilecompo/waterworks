<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

include 'connection.php';

function getBusinessDays($startDate, $endDate, $intervalDays) {
    $businessDays = 0;
    $currentDate = strtotime($startDate);
    $endDate = strtotime($endDate);

    while ($currentDate <= $endDate && $businessDays < $intervalDays) {
        // Check if the current day is not Saturday or Sunday
        if (date('N', $currentDate) < 6) {
            $businessDays++;
        }
        // Move to the next day
        $currentDate = strtotime('+1 day', $currentDate);
    }

    // If the last day falls on Saturday or Sunday, adjust to the next working day
    while (date('N', $currentDate) > 5) {
        $currentDate = strtotime('+1 day', $currentDate);
    }

    return date('F j Y', $currentDate);
}

// Get the account ID sent from the client
$accId = $_POST['accId'];

try {
    // Calculate the interval days
    $startDate = date('Y-m-d'); // Today's date
    $endDate = date('Y-m-d', strtotime('+30 days')); // or whatever your end date is
    $intervalDays = 20; // 20 working days
    $formatted_reading_date1 = getBusinessDays($startDate, $endDate, $intervalDays);
    $penalty = 0.1;

    $stmt = $conn->prepare("SELECT
            a.billing_id, a.period_cover,
            b.firstname AS emp_firstname, b.middlename AS emp_middlename, b.lastname AS emp_lastname,
            c.user_id, c.meter_no,
            c.firstname AS con_firstname, c.middlename AS con_middlename, c.lastname AS con_lastname,
            d.zone_name, e.barangay_name,
            f.municipality_name,
            a.cubic_consumed,
            DATE_FORMAT(a.reading_date, '%M %d %Y %h:%i %p') AS reading_date,
            DATE_FORMAT(a.reading_date, '%M %d') AS reading_date1,
            DATE_FORMAT(a.due_date, '%M %d %Y') AS due_date,
            :formatted_reading_date1 AS formatted_reading_date1,
            DATE_FORMAT(a.reading_date, '%M %Y') AS formatted_reading_date2,
            a.previous_meter,
            a.present_meter,
            a.arrears,
            a.bill_amount,
            a.total_bill
        FROM billing a
        INNER JOIN user_employee b ON a.readerId = b.user_id
        INNER JOIN user_consumer c ON a.consumerId = c.user_id
        INNER JOIN address_zone d ON c.addressId = d.zone_id
        INNER JOIN address_barangay e ON d.barangayId = e.barangay_id
        INNER JOIN address_municipality f ON e.municipalityId = f.municipality_id
        WHERE a.consumerId = :accId AND a.billing_statusId = 2 ORDER BY billing_id DESC ");

    $stmt->bindParam(":accId", $accId, PDO::PARAM_INT);
    $stmt->bindParam(":formatted_reading_date1", $formatted_reading_date1);
    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($results) > 0) {
        // Calculate amount_due for each row and format as decimal
        foreach ($results as &$row) {
            $row['amount_due'] = number_format($row['bill_amount'] + ($row['bill_amount'] * $penalty) + $row['arrears'], 2);
            $row['arrears'] = number_format($row['arrears'], 2);
            $row['bill_amount'] = number_format($row['bill_amount'], 2);
            $row['total_bill'] = number_format($row['total_bill'], 2);
        }
        unset($row); // Unset the reference variable to prevent unwanted modifications

        // Consumer data found
        echo json_encode($results);
    } else {
        // Consumer not found
        echo json_encode(["error" => "Reader data not found or is invalid"]);
    }
} catch (PDOException $e) {
    // Handle database errors
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    exit(); // Terminate script execution after encountering an error
}

?>
