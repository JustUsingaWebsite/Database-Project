from flask import jsonify
import sqlite3

def UpdateLoan(isbn, returndate, patronid=None, loandate=None):
    conn = None
    try:
        conn = sqlite3.connect('./database/libraryDatabase.db')
        c = conn.cursor()

        # First, update the Loans table
        query = "UPDATE Loans SET ReturnDate = ? WHERE ISBN = ? AND (ReturnDate IS NULL OR ReturnDate = '')"
        params = [returndate, isbn]
        c.execute(query, params)
        
        loans_updated = c.rowcount

        if loans_updated == 0:
            conn.close()
            return jsonify({'message': 'No active loan found for the given ISBN'}), 404

        # If Loans update was successful, update the Books table
        c.execute("""
            UPDATE Books 
            SET CopiesAvailable = CopiesAvailable + 1 
            WHERE ISBN = ?""", (isbn,))
        
        conn.commit()
        
        return jsonify({'message': 'Book loan updated successfully'})

    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

def UpdateBook(isbn: str, title=None, year=None, copies=None, authors=None, categories=None):
    if not isbn:
        return jsonify({'error': 'ISBN is required for updating a book'}), 400

    conn = None
    try:
        conn = sqlite3.connect('./database/libraryDatabase.db')
        c = conn.cursor()

        # Update the Books table
        query = "UPDATE Books SET Title = ?, YearOfPublication = ?, CopiesAvailable = ? WHERE ISBN = ?"
        c.execute(query, (title, year, copies, isbn))

        # Update Authors
        if authors is not None:
            # Delete existing authors
            c.execute("DELETE FROM BookAuthors WHERE ISBN = ?", (isbn,))
            for author in authors:
                # Get AuthorID by name
                c.execute("SELECT AuthorID FROM Authors WHERE Name = ?", (author,))
                author_id = c.fetchone()
                if author_id:
                    c.execute("INSERT INTO BookAuthors (ISBN, AuthorID) VALUES (?, ?)", (isbn, author_id[0]))
                else:
                    print(f"Author not found: {author}")

        # Update Categories
        if categories is not None:
            print(f"Updating categories for ISBN: {isbn}, Categories: {categories}")
            # Delete existing categories
            c.execute("DELETE FROM BookCategories WHERE ISBN = ?", (isbn,))
            for category in categories:
                # Get CategoryID by name
                c.execute("SELECT CategoryID FROM Categories WHERE Name = ?", (category,))
                category_id = c.fetchone()
                if category_id:
                    c.execute("INSERT INTO BookCategories (ISBN, CategoryID) VALUES (?, ?)", (isbn, category_id[0]))
                else:
                    print(f"Category not found: {category}")

        conn.commit()
        return jsonify({'message': 'Book updated successfully'})

    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        print(f"SQLite error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()
