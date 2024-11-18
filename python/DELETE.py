import sqlite3
from flask import jsonify

def Delete(entry_type, entry_id):
    if not entry_type or not entry_id:
        return jsonify({'error': 'Type and ID are required'}), 400

    try:
        conn = sqlite3.connect('./database/libraryDatabase.db')
        c = conn.cursor()

        if entry_type == 'book':
            # Check and delete loans associated with the book
            c.execute("DELETE FROM Books WHERE ISBN = ?", (entry_id,))

        elif entry_type == 'patron':
            # Check and delete loans associated with the patron
            c.execute("DELETE FROM Patrons WHERE PatronID = ?", (entry_id,))

        elif entry_type == 'loan':
            # Delete a specific loan
            c.execute("DELETE FROM Loans WHERE LoanID = ?", (entry_id,))
            

        else:
            return jsonify({'error': 'Invalid type specified'}), 400

        # Commit changes
        conn.commit()

        if c.rowcount == 0:
            return jsonify({'error': f'No entry found for the given {entry_type} ID'}), 404

        return jsonify({'message': f'{entry_type.capitalize()} deleted successfully'}), 200

    except sqlite3.Error as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if conn:
            conn.close()
