import sqlite3
from collections import defaultdict

def fetch_all_data():
    conn = sqlite3.connect('./database/libraryDatabase.db')
    cursor = conn.cursor()
    
    # Fetch authors
    cursor.execute("SELECT * FROM Authors")
    authors = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]

    # Fetch books
    cursor.execute("SELECT * FROM Books")
    books = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]

    # Fetch patrons
    cursor.execute("SELECT * FROM Patrons")
    patrons = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]

    # Fetch loans
    cursor.execute("SELECT * FROM Loans")
    loans = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]

    # Fetch roles
    cursor.execute("SELECT * FROM Roles")
    roles = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]

    # Fetch categories
    cursor.execute("SELECT * FROM Categories")
    categories = [dict(zip([column[0] for column in cursor.description], row)) for row in cursor.fetchall()]

    # Fetch book authors and group by ISBN
    cursor.execute("""
        SELECT Books.ISBN, Authors.Name FROM BookAuthors
        JOIN Authors ON BookAuthors.AuthorID = Authors.AuthorID
        JOIN Books ON BookAuthors.ISBN = Books.ISBN
    """)
    book_authors = defaultdict(list)
    for isbn, author_name in cursor.fetchall():
        book_authors[isbn].append(author_name)

    # Fetch book categories and group by ISBN
    cursor.execute("""
        SELECT Books.ISBN, Categories.Name FROM BookCategories
        JOIN Categories ON BookCategories.CategoryID = Categories.CategoryID
        JOIN Books ON BookCategories.ISBN = Books.ISBN
    """)
    book_categories = defaultdict(list)
    for isbn, category_name in cursor.fetchall():
        book_categories[isbn].append(category_name)

    # Add authors and categories to each book
    for book in books:
        book['Authors'] = book_authors.get(book['ISBN'], [])
        book['Categories'] = book_categories.get(book['ISBN'], [])

    # Close the connection
    conn.close()
    
    # Return the data in a JSON-compatible format
    data = {
        "authors": authors,
        "books": books,
        "patrons": patrons,
        "loans": loans,
        "roles": roles,
        "categories": categories
    }
    
    return data
