from flask import jsonify
import sqlite3
#to do list
# make the whole thing universal that whatever paramater is provided is what will be updated
#if not provided then not updated

def UpdateLoan(loanid, patronid=None, isbn=None, loandate=None, returndate=None):
    conn = None
    try:
        conn = sqlite3.connect('./database/libraryDatabase.db')
        c = conn.cursor()

        # Verify loan exists
        c.execute("SELECT ISBN, ReturnDate FROM Loans WHERE LoanID = ?", (loanid,))
        loan_data = c.fetchone()
        if not loan_data:
            return jsonify({'message': 'Loan not found'}), 404

        current_isbn, current_returndate = loan_data

        # Track changes for conditional updates
        updates = []
        params = []

        # Update PatronID if provided
        if patronid is not None:
            updates.append("PatronID = ?")
            params.append(patronid)

        # Update LoanDate if provided
        if loandate is not None:
            updates.append("LoanDate = ?")
            params.append(loandate)

        # Update ISBN if provided
        if isbn is not None and isbn != current_isbn:
            # Update copies for current ISBN
            c.execute("UPDATE Books SET CopiesAvailable = CopiesAvailable + 1 WHERE ISBN = ?", (current_isbn,))
            # Update copies for new ISBN
            c.execute("UPDATE Books SET CopiesAvailable = CopiesAvailable - 1 WHERE ISBN = ?", (isbn,))
            updates.append("ISBN = ?")
            params.append(isbn)

        # Update ReturnDate if provided
        if returndate is not None:
            if not current_returndate and returndate:  # Returning a previously loaned book
                c.execute("UPDATE Books SET CopiesAvailable = CopiesAvailable + 1 WHERE ISBN = ?", (isbn or current_isbn,))
            elif current_returndate and not returndate:  # Re-loaning a returned book
                c.execute("UPDATE Books SET CopiesAvailable = CopiesAvailable - 1 WHERE ISBN = ?", (isbn or current_isbn,))
            updates.append("ReturnDate = ?")
            params.append(returndate)

        # If only loanID is provided, return failure
        if not updates:
            return jsonify({'message': 'No updates provided'}), 400

        # Apply updates to Loans table
        params.append(loanid)
        query = f"UPDATE Loans SET {', '.join(updates)} WHERE LoanID = ?"
        c.execute(query, params)

        conn.commit()
        return jsonify({'message': 'Loan updated successfully'})

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


def UpdatePatron(patronid: str, name=None, email=None, phone=None, address=None, username=None, password=None, role_id=None):
    if not patronid:
        return jsonify({'error': 'PatronID is required for updating a patron'}), 400

    # Create the base query
    query = "UPDATE Patrons SET "
    updates = []
    params = []

    # Add each non-empty parameter to the query and params list
    if name:
        updates.append("Name = ?")
        params.append(name)
    if email:
        updates.append("Email = ?")
        params.append(email)
    if phone:
        updates.append("PhoneNumber = ?")
        params.append(phone)
    if address:
        updates.append("Address = ?")
        params.append(address)
    if username:
        updates.append("Username = ?")
        params.append(username)
    if password:
        #hashed_password = generate_password_hash(password)
        updates.append("Password = ?")
        params.append(password)
    if role_id:
        updates.append("RoleID = ?")
        params.append(role_id)

    # If no updates are provided, return an error
    if not updates:
        return jsonify({'error': 'No valid fields provided for update'}), 400

    # Finalize the query
    query += ", ".join(updates) + " WHERE PatronID = ?"
    params.append(patronid)

    try:
        # Connect to the database
        conn = sqlite3.connect('./database/libraryDatabase.db')
        c = conn.cursor()

        # Execute the query
        c.execute(query, params)

        # Commit the changes
        conn.commit()

        if c.rowcount == 0:
            return jsonify({'error': 'No patron found with the given PatronID'}), 404

        return jsonify({'message': 'Patron updated successfully'}), 200

    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if conn:
            conn.close()
