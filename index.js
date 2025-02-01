const urlBase = 'http://poossmall.mooo.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// handle the login
function doLogin(event) {
    event.preventDefault(); // stops the inputs from clearing

    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    document.getElementById("loginResult").innerHTML = "";

    // add for case that user or password are not entered

    let tmp = { login: login, password: password };
    let jsonPayload = JSON.stringify(tmp); // convert to json string

    // api url
    let url = urlBase + '/Login.' + extension;

    // send login request
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    // response from server
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText); // response from the server
                userId = jsonObject.id; // save in userId

                if (userId < 1) // if the userID is invalid
                {
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    alert("User/Password didn't match.");
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "./home.html"; // redirect if successful
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

// save user data in cookies
function saveCookie() {
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    let expires = ";expires=" + date.toGMTString();
    document.cookie = "firstName=" + firstName + expires + ";path=/";
    document.cookie = "lastName=" + lastName + expires + ";path=/";
    document.cookie = "userId=" + userId + expires + ";path=/";
}

// read user data from cookies
function readCookie() {
    let userId = -1;
    let firstName = "";
    let lastName = "";
    let cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.startsWith("firstName=")) {
            firstName = cookie.substring("firstName=".length, cookie.length);
        } else if (cookie.startsWith("lastName=")) {
            lastName = cookie.substring("lastName=".length, cookie.length);
        } else if (cookie.startsWith("userId=")) {
            userId = parseInt(cookie.substring("userId=".length, cookie.length));
        }
    }

    if (userId < 0) {
        window.location.href = "index.html";
    } else {
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
    return userId;
}

// log out user, reset the data and clear cookies
function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie = "lastName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    document.cookie = "userId= ; expires = Thu, 01 Jan 1970 00:00:00 GMT;path=/";
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";
	
	let colorList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}


