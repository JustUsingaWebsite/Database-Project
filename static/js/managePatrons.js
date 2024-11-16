var db = false

async function LoadPatrons() {
    try {
        const response = await fetch('/api/data');
        const data = await response.json();
        const response2 = await fetch('/api/session');
        const data2 = await response2.json();

        const patrons = data.patrons;
        const cardGrid = document.querySelector('.card-grid');
        cardGrid.innerHTML = ''; // Clear existing content

        patrons.forEach(patron => {
            const card = document.createElement('div');
            card.classList.add('book-card');

            // Patron Image (use placeholder if not available)
            const img = document.createElement('img');
            img.src = "https://marketplace.canva.com/EAFaQMYuZbo/1/0/1003w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBU.jpg";
            img.alt = "Patron Image";
            img.classList.add('book-image');
            card.appendChild(img);

            // Overlay Section
            const overlay = document.createElement('div');
            overlay.classList.add('overlay');

            // Patron Name
            const name = document.createElement('h3');
            name.classList.add('Name');
            name.textContent = patron.Name;
            overlay.appendChild(name);

            // Patron Role
            const role = document.createElement('p');
            role.classList.add('role');
            role.innerHTML = `<em>${data.roles.find(r => r.RoleID === patron.RoleID).RoleName}</em>`;
            overlay.appendChild(role);

            // Address, Phone, and Email
            const address = document.createElement('p');
            address.classList.add('address');
            address.textContent = patron.Address;
            overlay.appendChild(address);

            const phone = document.createElement('p');
            phone.classList.add('phone-number');
            phone.textContent = patron.PhoneNumber;
            overlay.appendChild(phone);

            const email = document.createElement('p');
            email.classList.add('email');
            email.textContent = patron.Email;
            overlay.appendChild(email);

            // Edit and Delete Buttons
            const editBtn = document.createElement('button');
            editBtn.classList.add('edit-btn');
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => editPatron(patron.PatronID));
            overlay.appendChild(editBtn);

            const deleteBtn = document.createElement('button');
            deleteBtn.classList.add('delete-btn');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => deletePatron(patron.PatronID, data2.id));
            overlay.appendChild(deleteBtn);

            card.appendChild(overlay);
            cardGrid.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading patrons:", error);
        alert("Failed to load patrons. Please try again.");
    }
}



function editPatron(isbn) {
    if (db == true){ return;}
    db = true;

    const data = {
        action: 'edit',
        type: 'patron',
        id: isbn // For 'add' action, id might be empty initially
    };

    // Store the data in local storage
    localStorage.setItem('addEditData', JSON.stringify(data));

    window.location.href = "/add_edit";

    setTimeout(function() {
        db = false;
    }, 1000);
}

// Function to handle deleting a book
async function deletePatron(isbn, deleterid) {
    if (db == true){ return;}
    db = true;

    console.log('Delete patron with patronid:', isbn);
    // Implement your delete functionality here, using the isbn
    if (!confirm("Are you sure you want to delete this loan?")) {return;}
        
    const response = await fetch('/api/delete', {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ type: 'patron', isbn: isbn }),});

    if (response.ok) {
        db = false;
        if (isbn == deleterid){
            return window.location.href = "/logout";
        }
        location.reload();
    } else {
        const errorData = await response.json();
        alert(errorData.error || 'Failed to delete patron');
        console.error('Failed to delete patron');
        location.reload();
    }
}


var add_button = document.querySelector(".add-book-btn").addEventListener("click", function(){
    if (db == true){return;}
    db = true;

    // Define the data you want to store
    const data = {
        action: 'add',
        type: 'patron',
        id: '' // For 'add' action, id might be empty initially
    };

    // Store the data in local storage
    localStorage.setItem('addEditData', JSON.stringify(data));

    // Redirect to the add_edit page
    window.location.href = "/add_edit";

    setTimeout(function() {
        db = false;
    }, 1000);
});

// Call loadBooks when the page loads
window.onload = LoadPatrons;