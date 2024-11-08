async function loadLoans() {
    try {
        // Fetch the session to get the logged-in user's username
        const sessionResponse = await fetch('/api/session');
        const sessionData = await sessionResponse.json();

        // Fetch all data including patrons and loans
        const dataResponse = await fetch('/api/data');
        const data = await dataResponse.json();

        const patronID = sessionData['id']
        // Filter loans that belong to the logged-in patron
        const userLoans = data.loans.filter(loan => loan.PatronID === patronID);

        const cardGrid = document.querySelector('.card-grid');
        
        // Clear any existing content
        cardGrid.innerHTML = '';

        userLoans.forEach(loan => {
            const card = document.createElement('div');
            card.classList.add('book-card');
            card.setAttribute('loan-id', loan.LoanID)

            const book = data.books.find(b => b.ISBN === loan.ISBN);
            const title = book ? book.Title : 'Unknown Title';
            const bookImage = book?.image || 'https://marketplace.canva.com/EAFaQMYuZbo/1/0/1003w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBU.jpg';

            const loanDate = new Date(loan.LoanDate);
            const today = new Date();
            const daysSinceLoan = Math.floor((today - loanDate) / (1000 * 60 * 60 * 24));

            // Determine urgency color
            let urgencyColor = '';
            if (daysSinceLoan > 30) urgencyColor = 'red';
            else if (daysSinceLoan > 14) urgencyColor = 'yellow';

            // Add return button conditionally
            const returnButton = loan.ReturnDate ? '' : `<button class="return-button">Return Book</button>`;
            urgencyColor = loan.ReturnDate ? 'green' : urgencyColor;

            // Add return date if it exists
            const returnDateDisplay = loan.ReturnDate ? `<p class="item5">Return Date: ${loan.ReturnDate}</p>` : '';

            card.innerHTML = `
                <img src="${bookImage}" alt="${title}">
                <div class="overlay">
                    <div class="urgency-indicator" style="background-color: ${urgencyColor};"></div>
                    <h3 class="title">ISBN: ${loan.ISBN}</h3>
                    <p class="item2">Title: ${title}</p>
                    <p class="item3">Loan Date: ${loan.LoanDate}</p>
                    ${returnDateDisplay}
                     <p class="item4">Returned: ${loan.ReturnDate ? 'Yes' : 'No'}</p>
                    ${returnButton}
                </div>
            `;

            cardGrid.appendChild(card);
        });

        // Attach event listeners to all return buttons
        document.querySelectorAll('.return-button').forEach(button => {
            button.addEventListener('click', function() {
                const isbn = this.closest('.book-card').querySelector('.title').textContent.split('ISBN: ')[1];
                const LoanID = this.closest('.book-card').getAttribute('loan-id');
                returnBook(isbn, LoanID);
            });
        });
        
    } catch (error) {
        console.error('Error loading loans:', error);
    }
}

// Load loans when the page loads
window.onload = loadLoans;
