
<?php

	header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
	header("Access-Control-Allow-Headers: Content-Type, Authorization");
	header("Access-Control-Allow-Credentials: true");

	$inData = getRequestInfo(); //request needs first, last, login, password
	
	$id = 0;
	$firstName = "";
	$lastName = "";

	$conn = new mysqli("localhost", "messenger", "WeLoveCOP4331", "UserData"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("SELECT ID,First,Last FROM Users WHERE Login=?"); //checking to see if account already exists
		$stmt->bind_param("s", $inData["login"]); //corresponding data has a string, if it's two strings set to ss
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()) //if this goes through then the user already exists with that name, so we gotta return an error
		{
			//returnWithInfo( $row['First'], $row['Last'], $row['ID'] );
			returnWithError("User already exists.");
			$stmt->close();
			$conn->close();
		}
		else
		{
			if(empty($inData["first"]) || empty($inData["last"]) || empty($inData["login"]) || empty($inData["password"])){
				returnWithError("All fields are required.");
				$stmt->close();
				$conn->close();
				exit();
			}
			$stmt = $conn->prepare("INSERT into Users (First,Last,Login,Password) VALUES (?,?,?,?)");
			$stmt->bind_param("ssss", $inData["first"], $inData["last"], $inData["login"], $inData["password"]);
			if($stmt->execute()){
				returnWithInfo($conn->insert_id);
			}else{
				returnWithError("Unable to create user.");
				$stmt->close();
				$conn->close();
			}
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo($id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"","lastName":"","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
