var db = false

async function loadLoans() {
    try {
        // Fetch all data, including patrons, books, and loans
        const dataResponse = await fetch('/api/data');
        const data = await dataResponse.json();

        const cardGrid = document.querySelector('.card-grid');
        cardGrid.innerHTML = ''; // Clear any existing content

        // Loop through each loan to create a card
        data.loans.forEach(loan => {
            const card = document.createElement('div');
            card.classList.add('book-card');

            // Find the book and patron associated with the loan
            const book = data.books.find(b => b.ISBN === loan.ISBN);
            const patron = data.patrons.find(p => p.PatronID === loan.PatronID);

            // Set default values if the book or patron is not found
            const title = book ? book.Title : 'Unknown Title';
            const bookImage = book?.image || 'https://marketplace.canva.com/EAFaQMYuZbo/1/0/1003w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBU.jpg';
            const patronName = patron ? patron.Username : 'Unknown Patron';

            // Add loan information
            const loanDate = loan.LoanDate || 'N/A';
            const returnDate = loan.ReturnDate ? loan.ReturnDate : 'Not Returned';

            // Construct card content
            card.innerHTML = `
                <img src="${bookImage}" alt="${title}" class="book-image">
                <div class="overlay">
                    <h3 class="patron">Patron: ${patronName}</h3>
                    <p class="isbn">ISBN: ${loan.ISBN}</p>
                    <p class="start-date">Start Date: ${loanDate}</p>
                    <p class="return-date">Return Date: ${returnDate}</p>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            card.querySelector('.edit-btn').addEventListener('click', () => editLoan(loan.LoanID));
            card.querySelector('.delete-btn').addEventListener('click', () => deleteLoan(loan.ISBN));

            // Append the card to the grid
            cardGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading loans:', error);
    }
}


// Function to handle editing a book
function editLoan(isbn) {
    if (db == true){ return;}
    db = true;

    const data = {
        action: 'edit',
        type: 'loan',
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
async function deleteLoan(isbn) {
    if (db == true){ return;}
    db = true;

    console.log('Delete book with ISBN:', isbn);
    // Implement your delete functionality here, using the isbn
    if (!confirm("Are you sure you want to delete this book?")) {return;}
        
    const response = await fetch('/api/book/delete', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isbn }),});

    if (response.ok) {
        db = false;
        location.reload();
    } else {
        console.error('Failed to delete book');
    }
}

// Call loadBooks when the page loads
window.onload = loadLoans;



var add_button = document.querySelector(".add-book-btn").addEventListener("click", function(){
    if (db == true){return;}
    db = true;

    // Define the data you want to store
    const data = {
        action: 'add',
        type: 'loan',
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

