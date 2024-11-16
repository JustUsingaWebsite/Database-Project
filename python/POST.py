import sqlite3
from flask import jsonify
from werkzeug.security import generate_password_hash

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

async def add_loan(patronid, isbn, startdate, returndate=None):

    # Validate input data
    if not patronid or not isbn or not startdate:
        return jsonify({'error': 'Invalid input data'}), 400
    
    conn = None
    try:
        # Connect to the database
        conn = sqlite3.connect('./database/libraryDatabase.db')
        c = conn.cursor()

        # Validate that the book and patron exist before adding the loan
        c.execute("SELECT 1 FROM Patrons WHERE PatronID = ?", (patronid,))
        print("check 1")
        if not c.fetchone():
            return jsonify({'error': 'Invalid PatronID'}), 400

        c.execute("SELECT 1 FROM Books WHERE ISBN = ?", (isbn,))
        print("check 2")
        if not c.fetchone():
            return jsonify({'error': 'Invalid ISBN'}), 400

        # Insert loan entry
        c.execute("""
            INSERT INTO Loans (PatronID, ISBN, LoanDate, ReturnDate)
            VALUES (?, ?, ?, ?)
        """, (patronid, isbn, startdate, returndate))
        print("check 3")

        # Commit the transaction
        conn.commit()

        return jsonify({'message': 'Loan added successfully'}), 201

    except sqlite3.Error as e:
        # Rollback in case of error
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the connection
        if conn:
            conn.close()

def add_patron(name, email, phone, address, username, password, role_id=1):
    try:
        # Connect to the database
        conn = sqlite3.connect('./database/libraryDatabase.db')
        c = conn.cursor()

        # Hash the password for security
        # hashed_password = generate_password_hash(password)

        # Insert the new patron into the Patrons table
        query = """
            INSERT INTO Patrons (Name, Address, PhoneNumber, Email, Username, Password, RoleID)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """
        params = (name, address, phone, email, username, password, role_id)

        c.execute(query, params)
        
        # Commit the transaction
        conn.commit()

        return jsonify({'message': 'Patron added successfully'}), 201

    except sqlite3.IntegrityError as e:
        # Handle unique constraint violation, such as duplicate username or email
        return jsonify({'error': 'Patron already exists or duplicate entry found'}), 400

    except sqlite3.Error as e:
        # Handle other database errors
        return jsonify({'error': str(e)}), 500

    finally:
        if conn:
            conn.close()
