import sqlite3
from flask import jsonify

def loan_book(patron_id, isbn, loan_date):
    conn = sqlite3.connect('./database/libraryDatabase.db')
    cursor = conn.cursor()

    if (not patron_id or not isbn or not loan_date):
        conn.close()
        return jsonify({"message": "Invalid input!"}), 400
    
    # Check if there are available copies
    cursor.execute("SELECT CopiesAvailable FROM Books WHERE ISBN = ?", (isbn,))
    result = cursor.fetchone()
    
    if result and result[0] > 0:
        # Insert the loan record
        cursor.execute("""
            INSERT INTO Loans (PatronID, ISBN, LoanDate, ReturnDate) 
            VALUES (?, ?, ?, NULL)""", (patron_id, isbn, loan_date))
        
        # Decrease the number of copies available
        cursor.execute("""
            UPDATE Books 
            SET CopiesAvailable = CopiesAvailable - 1 
            WHERE ISBN = ?""", (isbn,))
        
        conn.commit()
        conn.close()
        return jsonify({"message": "Book loaned successfully!"}), 200
    else:
        conn.close()
        return jsonify({"message": "No copies available!"}), 400
    
import sqlite3
from flask import jsonify

def add_book(isbn, title, authors, categories, year, copies):
    conn = sqlite3.connect('./database/libraryDatabase.db')
    cursor = conn.cursor()

    # Input validation
    if not isbn or not title or not authors or not categories or not year or not copies:
        conn.close()
        return jsonify({"message": "Invalid input!"}), 400

    try:
        # Insert book if it doesn't already exist
        cursor.execute("SELECT 1 FROM Books WHERE ISBN = ?", (isbn,))
        if cursor.fetchone():
            conn.close()
            return jsonify({"message": "Book with this ISBN already exists!"}), 400

        # Insert new authors into Authors table if they don't exist
        author_ids = []
        for author in authors:
            cursor.execute("SELECT AuthorID FROM Authors WHERE Name = ?", (author,))
            result = cursor.fetchone()
            if result:
                author_id = result[0]
            else:
                cursor.execute("INSERT INTO Authors (Name) VALUES (?)", (author,))
                author_id = cursor.lastrowid
            author_ids.append(author_id)

        # Insert new categories into Categories table if they don't exist
        category_ids = []
        for category in categories:
            cursor.execute("SELECT CategoryID FROM Categories WHERE Name = ?", (category,))
            result = cursor.fetchone()
            if result:
                category_id = result[0]
            else:
                cursor.execute("INSERT INTO Categories (Name) VALUES (?)", (category,))
                category_id = cursor.lastrowid
            category_ids.append(category_id)

        # Insert book into Books table
        cursor.execute("""
            INSERT INTO Books (ISBN, Title, YearOfPublication, CopiesAvailable)
            VALUES (?, ?, ?, ?)
        """, (isbn, title, year, copies))

        # Insert into BookAuthors table to link authors with the book
        for author_id in author_ids:
            cursor.execute("""
                INSERT INTO BookAuthors (ISBN, AuthorID)
                VALUES (?, ?)
            """, (isbn, author_id))

        # Insert into BookCategories table to link categories with the book
        for category_id in category_ids:
            cursor.execute("""
                INSERT INTO BookCategories (ISBN, CategoryID)
                VALUES (?, ?)
            """, (isbn, category_id))

        # Commit the transaction
        conn.commit()
        return jsonify({"message": "Book added successfully!"}), 200

    except Exception as e:
        conn.rollback()
        return jsonify({"message": "An error occurred: " + str(e)}), 500

    finally:
        conn.close()

