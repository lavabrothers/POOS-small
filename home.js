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
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
    }
    return userId;
}

function fetchContacts() {
    //const userId = readCookie(); // Get the user ID from the cookie
    console.log("User ID in fetchContacts:", userId); // Debug log
    if (!userId) {
        console.error('User ID not found');
        return;
    }

    // Fetch all contacts from the server
    fetch('LAMPAPI/Search.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId, searchQuery: '' }) // Use the user ID from the cookie and search query
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

function showContacts(contacts) {
    console.log('Show Contacts:', contacts); // Debug log
    // Display contacts on the page
    const contactsList = document.querySelector('.contactsList');
    contactsList.innerHTML = '';
    contacts.forEach(contact => {
        const contactItem = document.createElement('div');
        contactItem.innerHTML = `
            <div>
                <input type="text" value="${contact.First}" id="firstName-${contact.ContID}">
                <input type="text" value="${contact.Last}" id="lastName-${contact.ContID}">
                <input type="text" value="${contact.Phone}" id="phoneNum-${contact.ContID}">
                <input type="email" value="${contact.Email}" id="email-${contact.ContID}">
                <button onclick="updateContact(${contact.ContID})">Save</button>
                <button onclick="deleteContact(${contact.ContID}, ${contact.UserID})">Delete</button>
            </div>
        `;
        contactsList.appendChild(contactItem);
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
            fetchContacts();
        }
    })
    .catch(error => console.error('Error:', error));
}

function updateContact(contactId) {
    userId = readCookie(); // Get the user ID from the cookie
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

function deleteContact(contactId, userId) {
    fetch('LAMPAPI/Delete.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ContID: contactId, UserID: userId })
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

function showCreateContactForm() {
    document.querySelector('.createContactForm').style.display = 'block';
}

document.getElementById('createContactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    userId = readCookie(); // Get the user ID from the cookie
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