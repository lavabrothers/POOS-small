const contacts = []

function fetchContacts() {
    // Fetch contacts from the server
    fetch('LAMPAPI/Search.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: 1, searchQuery: '' }) // Adjust userId as needed
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
        } else {
            showContacts(data.results);
        }
    })
    .catch(error => console.error('Error:', error));
}

function showContacts(contacts) {
    // Display contacts on the page
    const contactsList = document.querySelector('.contactsList');
    contactsList.innerHTML = '';
    contacts.forEach(contact => {
        const contactItem = document.createElement('div');
        contactItem.innerHTML = `
            <input type="text" value="${contact.First}" id="firstName-${contact.ContID}">
            <input type="text" value="${contact.Last}" id="lastName-${contact.ContID}">
            <input type="text" value="${contact.Phone}" id="phoneNum-${contact.ContID}">
            <input type="email" value="${contact.Email}" id="email-${contact.ContID}">
            <button onclick="updateContact(${contact.ContID})">Save</button>
            <button onclick="deleteContact(${contact.ContID}, ${contact.UserID})">Delete</button>
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
    const contact = {
        contID: contactId,
        firstName: document.getElementById(`firstName-${contactId}`).value,
        lastName: document.getElementById(`lastName-${contactId}`).value,
        email: document.getElementById(`email-${contactId}`).value,
        phoneNum: document.getElementById(`phoneNum-${contactId}`).value,
        userId: 1 // Adjust userId as needed
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
    const contact = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phoneNum: document.getElementById('phoneNum').value,
        userId: 1 // Adjust userId as needed
    };
    createContact(contact);
    document.querySelector('.createContactForm').style.display = 'none';
});

// Example usage
fetchContacts();