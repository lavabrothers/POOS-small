const urlBase = 'http://poossmall.mooo.com/LAMPAPI';
const extension = 'php';

// handle the signup
function doSignUp(event)
{
    event.preventDefault(); // stops the inputs from clearing

    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    const user = document.getElementById('username').value;

    var password = document.getElementById('password').value,
    confirmPassword = document.getElementById('confirmPassword').value;

    if(password !== confirmPassword){
        alert("Password didn't match. Try again.");
        return;
    }

    console.log("Passwords match..")

    const request = {
        first: firstName,
        last: lastName,
        login: user,
        password: password
    };

    const jsonPayload = JSON.stringify(request);

    document.getElementById("signUpResult").innerHTML = "";

    // api url
    let url = urlBase + '/Signup.' + extension;

    // send signup request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    // response from server
    try
    {
        xhr.onreadystatechange = function() 
        {
            if (this.readyState == 4 && this.status == 200) 
            {
                let response = JSON.parse(xhr.responseText); // response from the server
                
                if (response.error) {
                    document.getElementById('signUpResult').innerHTML = response.error;
                } else {
                    alert('Sign-up successful! Redirecting to login...');
                    window.location.href = './home.html'; // Redirect to the login page
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("signUpResult").innerHTML = err.message;
    }
}

// save user data in cookies
function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

// read user data from cookies
function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

// log out user, reset the data and clear cookies
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html"; // go to the login page
}


