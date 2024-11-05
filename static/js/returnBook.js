// Function to handle book return
async function returnBook(isbn) {
    try {

        const confirmLoan = confirm("Return this book? Proceed and Cancel");
        if (!confirmLoan) return;

        // Call the endpoint to process the return
        const response = await fetch('/api/returnbook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ isbn, date: new Date().toISOString().split('T')[0] })
        });
        
        if (response.ok) {
            alert('Book returned successfully!');
            loadLoans(); // Reload loans to update the UI
            window.location.reload()
        } else {
            alert('Failed to return the book. Please try again.' + response.json);
            window.location.reload()
        }
    } catch (error) {
        console.error('Error returning book:', error);
    }
}