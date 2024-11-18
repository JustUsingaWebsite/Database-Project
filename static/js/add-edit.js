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
        window.location.href = `/${type}Management`;
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
                typePatronEdit(id);
                break;
            case 'loan':
                typeLoanEdit(id)
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
            alert(error || "An error occurred while processing your request. Please try again.");
        }
    })
}

function typePatronAdd(){
    document.querySelector('.patron-section').style.display = "block";
    document.getElementById('patron-form').addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the default form submission

        // Variables to hold form data
        var name = document.getElementById('name').value;
        var email = document.getElementById('email').value;
        var phone = document.getElementById('phone_number').value;
        var address = document.getElementById('address').value;
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        var role = document.querySelector('input[name="role"]:checked').value;


        console.log('Name:', name);
        console.log('Email:', email);
        console.log('Phone:', phone);
        console.log('Address:', address);
        console.log('Username:', username);
        console.log('Password:', password);
        console.log('Role:', role);

        const confirmLoan = confirm("Add this patron? Proceed and Cancel");
        if (!confirmLoan) return;

        switch (role.toLowerCase()) {
            case 'patron':
                role = 3;
                break;
            case 'librarian':
                role = 2;
                break;
            case 'admin':
                role = 1;
                break;
        }
        
        const response = await fetch('/api/patron/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                phone: phone,
                address: address,
                username: username,
                password: password,
                role: role
            }),
        })
        if (response.ok) {
            alert("Patron added successfully!");
            localStorage.removeItem('addEditData');
            window.location.href = '/patronManagement'; // Redirect to the books page
        } else(error) => {
            console.error('Error:', error);
            alert(error || "An error occurred while processing your request. Please try again.");
        }
    })
}

function typeLoanAdd(){
    document.querySelector(".loan-section").style.display = "block";

    document.getElementById('loan-form').addEventListener('submit', async function(event) {
       event.preventDefault(); // Prevent the default form submission

       // Variables to hold form data
       var patron = document.getElementById('patron_id').value;
       var isbn = document.getElementById('isbn').value;

       //get all dates
       var startdate = document.getElementById('loan_date').value;
       var returndate = document.getElementById('return_date').value;

       console.log('Patron:', patron);
       console.log('ISBN:', isbn);
       console.log('Date Borrowed:', startdate);
       console.log('Date Due:', returndate);

       const confirmLoan = confirm("Add this book? Proceed and Cancel");
       if (!confirmLoan) return;

       const response = await fetch('/api/loan/add', {
           method: 'POST',
           headers: {
               'Content-Type': 'application/json',
           },
           body: JSON.stringify({
               patron: patron,
               isbn: isbn,
               startdate: startdate,
               returndate: returndate,
           }),
       })

       if (response.ok) {
           alert("Book added successfully!");
           localStorage.removeItem('addEditData');
           window.location.href = '/loanManagement'; // Redirect to the books page
       } else(error) => {
           console.error('Error:', error);
           alert(error ||"An error occurred while processing your request. Please try again.");
       }
   })
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
        alert(error ||"Failed to load book data. Please try again.");
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

async function typeLoanEdit(isbn) {
    // Display the loan editing section
    document.querySelector('.loan-section').style.display = "block";
    let loanData = null;

    try {
        // Fetch the loan data from the API
        const response = await fetch('/api/data');
        const data = await response.json();

        // Find the loan with the matching ISBN (LoanID in your schema)
        loanData = data.loans.find(loan => loan.LoanID === isbn);

        if (loanData) {
            // Populate the form fields with the fetched data
            document.getElementById('patron_id').value = loanData.PatronID;
            document.getElementById('isbn').value = loanData.ISBN;
            document.getElementById('loan_date').value = loanData.LoanDate;
            document.getElementById('return_date').value = loanData.ReturnDate;

            // Store the loan ID for the update operation
            document.getElementById('loan_id').value = loanData.LoanID;
        } else {
            alert("Loan not found. Please check the ISBN.");
        }

    } catch (error) {
        console.error("Error loading loan data:", error);
        alert("Failed to load loan data. Please try again.");
    }

    // Submit event listener for editing loan data
    document.getElementById('loan-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const confirmLoan = confirm("Edit this loan? Proceed or Cancel");
    if (!confirmLoan) return;

    try {
        const response = await fetch('/api/loan/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                loanid: document.getElementById('loan_id').value,
                patron: document.getElementById('patron_id').value,
                isbn: document.getElementById('isbn').value,
                startdate: document.getElementById('loan_date').value,
                returndate: document.getElementById('return_date').value,
            }),
        });

        if (response.ok) {
            alert("Loan edited successfully!");
            window.location.href = '/loanManagement'; // Redirect to the loans page
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert("An error occurred while processing your request. Please try again.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error ||"An unexpected error occurred. Please try again.");
    }
});
}

async function typePatronEdit(isbn){
    document.querySelector('.patron-section').style.display = "block";

    let PatronData = null;

    try {
        // Fetch the loan data from the API
        const response = await fetch('/api/data');
        const data = await response.json();

        // Find the loan with the matching ISBN (LoanID in your schema)
        PatronData = data.patrons.find(patron => patron.PatronID === isbn);

        if (PatronData) {
            // Populate the form fields with the fetched data
            document.getElementById('name').placeholder = PatronData.Name;
            document.getElementById('email').placeholder = PatronData.Email;
            document.getElementById('phone_number').placeholder = PatronData.PhoneNumber;
            document.getElementById('address').placeholder = PatronData.Address;
            document.getElementById('username').placeholder = PatronData.Username;
            document.getElementById('password').placeholder = PatronData.Password;
            
            
            switch(PatronData.RoleID){
                case 1:
                    document.querySelector("input[value='admin']").checked = true
                    break;
                case 2:
                    document.querySelector("input[value='librarian']").checked = true
                    break;
                case 3:
                    document.querySelector("input[value='patron']").checked = true
                    break;
            }

            // Store the loan ID for the update operation
            document.getElementById('patronid').value = PatronData.PatronID;
        } else {
            alert("Loan not found. Please check the ISBN.");
        }

    } catch (error) {
        console.error("Error loading loan data:", error);
        alert("Failed to load loan data. Please try again.");
    }

    // Submit event listener for editing loan data
    document.getElementById('patron-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const confirmLoan = confirm("Edit this loan? Proceed or Cancel");
    if (!confirmLoan) return;

    var role = document.querySelector('input[name="role"]:checked').value;

    switch (role.toLowerCase()) {
        case 'patron':
            role = 3;
            break;
        case 'librarian':
            role = 2;
            break;
        case 'admin':
            role = 1;
            break;
    }

    try {
        const response = await fetch('/api/patron/edit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            Patronid : document.getElementById('patronid').value,
            name : document.getElementById('name').value,
            email : document.getElementById('email').value,
            phone : document.getElementById('phone_number').value,
            address : document.getElementById('address').value,
            username : document.getElementById('username').value,
            password : document.getElementById('password').value,
            role : role
            }),
        });

        if (response.ok) {
            alert("Loan edited successfully!");
            window.location.href = '/patronManagement'; // Redirect to the loans page
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert("An error occurred while processing your request. Please try again.");
        }
    } catch (error) {
        console.error('Error:', error);
        alert(error ||"An unexpected error occurred. Please try again.");
    }
});
}
