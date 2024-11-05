async function loadBooks() {
    try {
        const response = await fetch('/api/data'); // Fetch from your API
        const data = await response.json();

        const cardGrid = document.querySelector('.card-grid');

        // Filter books with copies more than 0
        const availableBooks = data.books.filter(book => book.CopiesAvailable > 0);

        availableBooks.forEach(book => {
            const card = document.createElement('div');
            card.classList.add('book-card');

            // Join all authors and categories as comma-separated strings
            const authors = book.Authors.length > 0 ? book.Authors.join(', ') : 'Unknown Author';
            const categories = book.Categories.length > 0 ? book.Categories.join(', ') : 'Unknown Category';

            // Adjust the label based on the number of authors and categories
            const authorLabel = book.Authors.length === 1 ? 'Author' : 'Authors';
            const categoryLabel = book.Categories.length === 1 ? 'Category' : 'Categories';

            const bookImage = book.image || 'https://marketplace.canva.com/EAFaQMYuZbo/1/0/1003w/canva-brown-rusty-mystery-novel-book-cover-hG1QhA7BiBU.jpg'; // Placeholder if image URL is not available

            card.innerHTML = `
                <img src="${bookImage}" alt="${book.Title}">
                <div class="overlay">
                    <div class="copies">${book.CopiesAvailable}</div>
                    <h3 class="title">${book.Title}</h3>
                    <p class="author">${authorLabel}: ${authors}</p>
                    <p class="category">${categoryLabel}: ${categories}</p>
                    <p class="year">${book.YearOfPublication}</p>
                    <button class="loan-button">Loan Book</button>
                </div>
            `;

            cardGrid.appendChild(card);
        });

        // Attach loanBook function to each button after books are loaded
        document.querySelectorAll('.loan-button').forEach(button => {
            button.addEventListener('click', function() {
                const bookTitle = this.closest('.book-card').querySelector('.title').textContent; // Get the book title from the card
                loanBook(bookTitle); // Pass the book title to the loanBook function
            });
        });

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Call loadBooks when the page loads
window.onload = loadBooks;
