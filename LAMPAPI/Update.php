
<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization");
	header("Access-Control-Allow-Credentials: false");

	$inData = getRequestInfo(); //you need first, last, email, phone, contactID, and userid to update the contact. unchanged values are still processed
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phoneNum = $inData["phoneNum"];
    $userId = $inData["userId"];	
    $contID = $inData["contID"];

	$conn = new mysqli("localhost", "messenger", "WeLoveCOP4331", "UserData"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT INTO Contacts (CondID, First, Last, Phone, Email, UserID) VALUES (?,?,?,?,?,?) ON DUPLICATE KEY UPDATE ContID = VALUES(ContID), First = VALUES(First), Last = VALUES(Last), Phone = VALUES(Phone), Email = VALUES(Email), UserID = VALUES(UserID)");
        $stmt->bind_param("issssi", $contID, $firstName, $lastName, $phoneNum, $email,$userId);

        if($stmt->execute()){
            returnWithInfo($contID, $firstName, $lastName, $phoneNum, $userId, $email);
        }else{
            returnWithError("Unable to update contact");
        }

		$stmt->close();
		$conn->close();
	}


	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
        $retValue = '{"ContID":,"UserId":,"firstName":"","lastName":"","phone":"","email":"","error":"' . $err .'"}';
		sendResultInfoAsJson( $retValue );
	}
    function returnWithInfo($contID, $first, $last, $phone, $email, $userid)
    {
        $retValue = '{"ContID":'. $contID .',"UserId":' . $userid . ',"firstName":"' . $first . '","lastName":"' . $last . '","phone":"' . $phone . '","email":"' . $email . '","error":""}';
        sendResultInfoAsJson($retValue);
    }

	
?>
