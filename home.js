const contacts = []

function readCookie() {
    let userId = -1;
    let firstName = "";
    let lastName = "";
    let data = document.cookie;
    console.log("Cookie data:", data); // Debug log
    let splits = data.split(",");
    for (var i = 0; i < splits.length; i++) {
        let thisOne = splits[i].trim();
        let tokens = thisOne.split("=");
        if (tokens[0] == "firstName") {
            firstName = tokens[1];
        } else if (tokens[0] == "lastName") {
            lastName = tokens[1];
        } else if (tokens[0] == "userId") {
            userId = parseInt(tokens[1].trim());
        }
    }

    console.log("Parsed userId from cookie:", userId); // Debug log

    if (userId < 0) {
        window.location.href = "index.html";
    } else {
        const userNameElement = document.getElementById("userName");
        if (userNameElement) {
            userNameElement.innerHTML = "Logged in as " + firstName + " " + lastName;
        }
    }
    return userId;
}

function fetchContacts() {
    const userId = readCookie(); // Get the user ID from the cookie
    console.log("User ID in fetchContacts:", userId); // Debug log
    if (!userId) {
        console.error('User ID not found');
        return;
    }

    const searchPayload = { userId: userId, searchQuery: '' }; // Use the user ID from the cookie and search query
    console.log("Payload being sent to Search.php:", searchPayload); // Debug log

    // Fetch all contacts from the server
    fetch('LAMPAPI/Search.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchPayload)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Fetch Contacts Response:', data); // Debug log
        if (data.error) {
            console.error(data.error);
        } else {
            showContacts(data.results);
        }
    })
    .catch(error => console.error('Error:', error));
}

function searchContacts() {
    const userId = readCookie(); // Get the user ID from the cookie
    console.log("User ID in searchContacts:", userId); // Debug log
    if (!userId) {
        console.error('User ID not found');
        return;
    }

    let searchQuery = document.getElementById("searchText").value;
    const searchPayload = { userId: userId, searchQuery: searchQuery }; // Use the user ID from the cookie and search query
    console.log("Payload being sent to Search.php:", searchPayload); // Debug log

    // Fetch contacts based on the search query from the server
    fetch('LAMPAPI/Search.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchPayload)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Search Contacts Response:', data); // Debug log
        if (data.error) {
            console.error(data.error);
        } else {
            showContacts(data.results);
        }
    })
    .catch(error => console.error('Error:', error));
}

function showContacts(contacts) {
    console.log('Show Contacts:', contacts); // Debug log
    // Display contacts on the page
    const contactsTableBody = document.querySelector('#contactsTable tbody');
    contactsTableBody.innerHTML = '';
    contacts.forEach(contact => {
        const contactRow = document.createElement('tr');
        contactRow.innerHTML = `
            <td><input type="text" id="firstName-${contact.ContID}" value="${contact.First}"></td>
            <td><input type="text" id="lastName-${contact.ContID}" value="${contact.Last}"></td>
            <td><input type="text" id="phoneNum-${contact.ContID}" value="${contact.Phone}"></td>
            <td class="email-column"><input type="text" id="email-${contact.ContID}" value="${contact.Email}"></td>
            <td>
                <button onclick="updateContact(${contact.ContID})"><i class="material-icons">mode_edit</i>Save</button>
                <button onclick="deleteContact(${contact.ContID})"><i class="material-icons">delete</i>Delete</button>
            </td>
        `;
        contactsTableBody.appendChild(contactRow);
    });
}

function createContact(contact) {
    fetch('LAMPAPI/Create.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
        } else {
            fetchContacts(); // Fetch and display contacts after creating a new one
        }
    })
    .catch(error => console.error('Error:', error));
}

function updateContact(contactId) {
    const userId = readCookie(); // Get the user ID from the cookie
    console.log("User ID in updateContact:", userId); // Debug log
    if (!userId) {
        console.error('User ID not found');
        return;
    }

    const contact = {
        contID: contactId,
        firstName: document.getElementById(`firstName-${contactId}`).value,
        lastName: document.getElementById(`lastName-${contactId}`).value,
        email: document.getElementById(`email-${contactId}`).value,
        phoneNum: document.getElementById(`phoneNum-${contactId}`).value,
        userId: userId // Use the user ID from the cookie
    };
    fetch('LAMPAPI/Update.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
        } else {
            fetchContacts();
        }
    })
    .catch(error => console.error('Error:', error));
}

function deleteContact(contactId) {
    const userId = readCookie(); // Get the user ID from the cookie

    console.log(`Deleting contact with ID: ${contactId} for user ID: ${userId}`); // Debug log

    if (!contactId || !userId) {
        console.error('Missing ContID or UserID');
        return;
    }

    fetch('LAMPAPI/Delete.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ContID: contactId, UserID: userId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Delete Contact Response:', data); // Debug log
        if (data.error) {
            console.error(data.error);
        } else {
            fetchContacts(); // Refresh the contact list after deletion
        }
    })
    .catch(error => console.error('Error:', error));
}

function showCreateContactForm() {
    document.querySelector('.createContactForm').style.display = 'block';
}

function doLogout() {
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "lastName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "userId= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html"; // go to the login page
}

document.getElementById('createContactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const userId = readCookie(); // Get the user ID from the cookie
    console.log("User ID in createContact:", userId); // Debug log
    if (!userId) {
        console.error('User ID not found');
        return;
    }

    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNum: document.getElementById('phoneNum').value,
        userId: userId // Use the user ID from the cookie
    };
    createContact(contact);
    document.querySelector('.createContactForm').style.display = 'none';
});

// Fetch and display contacts when the page loads
document.addEventListener('DOMContentLoaded', fetchContacts);