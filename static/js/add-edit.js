// what we need
var action, type, id 
const storedData = localStorage.getItem('addEditData');
if (storedData) {
    const data = JSON.parse(storedData);
    action = data.action;
    type = data.type;
    id = data.id;
} else {
    console.error('No data found in local storage');
}

let cancel_buttons = document.querySelectorAll('button[type=reset]')
for (let i = 0; i < cancel_buttons.length; i++) {
    cancel_buttons[i].addEventListener('click', function() {
        localStorage.removeItem('addEditData');
        window.location.href = '/bookManagement';
    });
}

switch(action){
    case 'add':
        switch(type){
            case 'book':
                typeBookAdd();
                break;
            case 'patron':
                typePatronAdd();
                break;
            case 'loan':
                typeLoanAdd();
                break;
        }
        break;
    case 'edit':
        switch(type){
            case 'book':
                typeBookEdit(id);
                break;
            case 'patron':
                typePatronEdit();
                break;
            case 'loan':
                typeLoanEdit();
                break;
        }
        break;
}



// Add Section
 function typeBookAdd(){
    document.querySelector(".book-section").style.display = "block";

     document.getElementById('book-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Variables to hold form data
        var title = document.getElementById('title').value;
        var isbn = document.getElementById('isbn_id').value;

        // Get all categories
        var categoryInputs = document.getElementsByName('categories[]');
        var categories = Array.from(categoryInputs).map(input => input.value);

        // Get all authors
        var authorInputs = document.getElementsByName('authors[]');
        var authors = Array.from(authorInputs).map(input => input.value);

        var yearOfPublication = document.getElementById('yearofpublication').value;
        var copies = document.getElementById('copies').value;

        console.log('Title:', title);
        console.log('ISBN:', isbn);
        console.log('Categories:', categories);
        console.log('Authors:', authors);
        console.log('Year of Publication:', yearOfPublication);
        console.log('Copies:', copies)

        const confirmLoan = confirm("Add this book? Proceed and Cancel");
        if (!confirmLoan) return;

        const response = await fetch('/api/book/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                isbn: isbn,
                categories: categories,
                authors: authors,
                yearOfPublication: yearOfPublication,
                copies: copies
            }),
        })
        if (response.ok) {
            alert("Book added successfully!");
            localStorage.removeItem('addEditData');
            window.location.href = '/bookManagement'; // Redirect to the books page
        } else(error) => {
            console.error('Error:', error);
            alert("An error occurred while processing your request. Please try again.");
        }
    })
}

function typePatronAdd(){
    document.querySelector('.patron-section').style.display = "block";
}

function typeLoanAdd(){
    document.querySelector('.loan-section').style.display = "block";
}

// Edit Section
async function typeBookEdit(isbn) {
    // Display the book editing section
    document.querySelector('.book-section').style.display = "block";
    let bookData = null

    try {
        // Fetch the book data from the API
        const response = await fetch(`/api/data`);
        const data = await response.json();

        // Find the book with the matching ISBN
        bookData = data.books.find(book => book.ISBN === isbn);

        if (bookData) {
            // Populate the form fields with the fetched data
            document.getElementById('title').value = bookData.Title;
            document.getElementById('isbn_id').value = bookData.ISBN;
            document.getElementById('yearofpublication').value = bookData.YearOfPublication;
            document.getElementById('copies').value = bookData.CopiesAvailable;

            // Populate authors
            const authorContainer = document.getElementById('author-container');
            authorContainer.innerHTML = ''; // Clear existing entries
            bookData.Authors.forEach(author => {
                const authorItem = document.createElement('div');
                authorItem.classList.add('author-item');
                authorItem.innerHTML = `
                    <input type="text" name="authors[]" value="${author}" required>
                    <button type="button" class="remove-author">Remove</button>
                `;
                authorContainer.appendChild(authorItem);
            });

            // Populate categories
            const categoryContainer = document.getElementById('category-container');
            categoryContainer.innerHTML = ''; // Clear existing entries
            bookData.Categories.forEach(category => {
                const categoryItem = document.createElement('div');
                categoryItem.classList.add('category-item');
                categoryItem.innerHTML = `
                    <input type="text" name="categories[]" value="${category}" required>
                    <button type="button" class="remove-category">Remove</button>
                `;
                categoryContainer.appendChild(categoryItem);
            });
        } else {
            alert("Book not found. Please check the ISBN.");
        }
    } catch (error) {
        console.error("Error loading book data:", error);
        alert("Failed to load book data. Please try again.");
    }

    document.getElementById('book-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const confirmLoan = confirm("Edit this book? Proceed and Cancel");
    if (!confirmLoan) return;

    try {
        const response = await fetch('/api/book/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: document.getElementById('title').value,
                isbn: document.getElementById('isbn_id').value,
                categories: Array.from(document.querySelectorAll('input[name="categories[]"]')).map(input => input.value),
                authors: Array.from(document.querySelectorAll('input[name="authors[]"]')).map(input => input.value),
                yearOfPublication: document.getElementById('yearofpublication').value,
                copies: document.getElementById('copies').value
            }),
        });

        if (response.ok) {
            alert("Book edited successfully!");
            localStorage.removeItem('addEditData');
            window.location.href = '/books'; // Redirect to the books page
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert("An error occurred while processing your request. Please try again.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert("An unexpected error occurred. Please try again.");
    }})
}



function typePatronEdit(){
    document.querySelector('.patron-section').style.display = "block";
}

function typeLoanEdit(){
    document.querySelector('.loan-section').style.display = "block";
}