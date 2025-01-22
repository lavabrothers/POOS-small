<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();


if (empty($inData["ContID"]) || empty($inData["UserID"])) {
    die(json_encode(["error" => "Missing ContID or UserID."]));
}

$contID = $inData["ContID"];
$userID = $inData["UserID"];


$conn = new mysqli("localhost", "messenger", "WeLoveCOP4331", "UserData");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}


$stmt = $conn->prepare("DELETE FROM Contacts WHERE ContID = ? AND UserID = ?");
if (!$stmt) {
    $conn->close();
    die(json_encode(["error" => "Prepare failed: " . $conn->error]));
}

$stmt->bind_param("ii", $contID, $userID);


if (!$stmt->execute()) {
    $stmt->close();
    $conn->close();
    die(json_encode(["error" => "Execute failed: " . $stmt->error]));
}


if ($stmt->affected_rows > 0) {
    $response = ["success" => true, "message" => "Contact deleted successfully."];
} else {
    $response = ["success" => false, "message" => "No contact found with the given ContID and UserID."];
}


$conn->close();


echo json_encode($response);

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

?>
