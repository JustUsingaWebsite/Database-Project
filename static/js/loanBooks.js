async function loanBook(bookTitle) {
    try {
        // Fetch the session data to get the patron information
        const sessionResponse = await fetch('/api/session');
        const sessionData = await sessionResponse.json();
        
        // Retrieve logged-in user info
        const username = sessionData.username;

        // Fetch patron data to get the PatronID
        const dataResponse = await fetch('/api/data');
        const data = await dataResponse.json();
        const patron = data.patrons.find(p => p.Username === username);

        // Check if patron is found
        if (!patron) {
            alert("Patron not found! Please log in again.");
            return;
        }

        const patronID = patron['PatronID'];

        // Find the book's ISBN based on the title
        const book = data.books.find(b => b.Title === bookTitle);
        if (!book) {
            alert("Book not found! Please try again.");
            return;
        }
        const isbn = book['ISBN'];

        // Confirm loan action
        const confirmLoan = confirm("Loan this book? Proceed and Cancel");
        if (!confirmLoan) return;

        // Prepare the loan data
        const loanData = {
            patronID: patronID,
            isbn: isbn,
            loanDate: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
        };

        console.log(JSON.stringify(loanData));

        // Send loan request
        const response = await fetch('/api/loanbook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loanData),
        });

        if (response.ok) {
            // Loan was successful
            alert("Loaned successfully!");
            window.location.href = '/loans'; // Redirect to the loans page
        } else {
            // Loan was unsuccessful
            alert("Loan unsuccessful! Please try again.");
            location.reload(); // Reload the page to try again
        }
    } catch (error) {
        console.error('Error loaning book:', error);
        alert("An error occurred while processing your request. Please try again.");
    }
}

