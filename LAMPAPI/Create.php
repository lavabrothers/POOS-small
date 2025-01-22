<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$inData = getRequestInfo();

// Validate input data
if (empty($inData["firstName"]) || empty($inData["lastName"]) || 
    empty($inData["email"]) || empty($inData["phoneNum"]) || empty($inData["userId"])) {
    die(json_encode(["error" => "Missing required fields."]));
}

$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$email = $inData["email"];
$phoneNum = $inData["phoneNum"];
$userId = $inData["userId"];

$conn = new mysqli("localhost", "messenger", "WeLoveCOP4331", "UserData");
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

$stmt = $conn->prepare("INSERT INTO Contacts (First, Last, Phone, Email, UserID) VALUES (?, ?, ?, ?, ?)");
if (!$stmt) {
    die(json_encode(["error" => "Prepare failed: " . $conn->error]));
}

$stmt->bind_param("ssssi", $firstName, $lastName, $phoneNum, $email, $userId);

if (!$stmt->execute()) {
    $stmt->close();
    $conn->close();
    die(json_encode(["error" => "Execute failed: " . $stmt->error]));
}

// Return success response
$response = ["id" => $conn->insert_id, "error" => ""];
$stmt->close();
$conn->close();

echo json_encode($response);

function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}
