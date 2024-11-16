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

async function loadMostPopularBook() {
    try {
        // Fetch all data
        const dataResponse = await fetch('/api/data');
        const data = await dataResponse.json();

        // Count loans per book
        const loanCounts = data.loans.reduce((counts, loan) => {
            counts[loan.ISBN] = (counts[loan.ISBN] || 0) + 1;
            return counts;
        }, {});

        // Find the ISBN with the most loans
        const mostPopularISBN = Object.keys(loanCounts).reduce((a, b) => loanCounts[a] > loanCounts[b] ? a : b);

        // Find book details
        const book = data.books.find(b => b.ISBN === mostPopularISBN);

        if (!book) {
            console.warn('No popular book found.');
            return;
        }

        // Populate the most popular book card
        const popularBookCard = document.querySelector('.popular-book-card');
        const img = popularBookCard.querySelector('.popular-book-img');
        const title = popularBookCard.querySelector('.popular-title');
        const author = popularBookCard.querySelector('.popular-author');
        const category = popularBookCard.querySelector('.popular-category');
        const loans = popularBookCard.querySelector('.popular-loans');

        img.src = book.image || 'https://via.placeholder.com/300x400?text=No+Image';
        img.alt = book.Title;
        title.textContent = `Title: ${book.Title}`;
        author.textContent = `Author: ${book.Authors.join(', ')}`;
        category.textContent = `Category: ${book.Categories.join(', ')}`;
        loans.textContent = `Loans: ${loanCounts[mostPopularISBN]} times`;

    } catch (error) {
        console.error('Error loading most popular book:', error);
    }
}

// Load the most popular book when the page loads
window.onload = () => {
    loadBooks(); // Existing function
    loadMostPopularBook();
};

