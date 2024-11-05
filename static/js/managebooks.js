var db = false

async function loadBooks() {
    try {
        const response = await fetch('/api/data'); // Fetch data from the API
        const data = await response.json();

        const cardGrid = document.querySelector('.card-grid');
        cardGrid.innerHTML = ''; // Clear existing content

        data.books.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('book-card');

            const bookImage = book.image || 'https://marketplace.canva.com/EAFaQMYuZbo/1/0/1003w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBU.jpg';

            card.innerHTML = `
                <img src="${bookImage}" alt="${book.Title}" class="book-image">
                <div class="overlay">
                    <h3 class="title">${book.Title}</h3>
                    <p class="isbn">ISBN: ${book.ISBN}</p>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            // Add event listeners for edit and delete buttons
            card.querySelector('.edit-btn').addEventListener('click', () => editBook(book.ISBN));
            card.querySelector('.delete-btn').addEventListener('click', () => deleteBook(book.ISBN));

            cardGrid.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching books:', error);
    }
}

// Function to handle editing a book
function editBook(isbn) {
    if (db == true){ return;}
    db = true;

    const data = {
        action: 'edit',
        type: 'book',
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
async function deleteBook(isbn) {
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
window.onload = loadBooks;



var add_button = document.querySelector(".add-book-btn").addEventListener("click", function(){
    if (db == true){return;}
    db = true;

    // Define the data you want to store
    const data = {
        action: 'add',
        type: 'book',
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

