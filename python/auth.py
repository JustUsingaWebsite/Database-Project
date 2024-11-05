import sqlite3

def authenticate_user(username, password):
    conn = sqlite3.connect('./database/libraryDatabase.db')
    cursor = conn.cursor()
    # Adjust the query to fetch the user's role along with other user details
    cursor.execute("""
        SELECT * FROM Patrons 
        WHERE Username = ? AND Password = ?
    """, (username, password))
    user = cursor.fetchone()
    
    # Check if the user was found
    if user:
        # Assuming the role is in a separate table (Roles), retrieve it based on RoleID
        cursor.execute("""
            SELECT RoleName FROM Roles
            WHERE RoleID = ?
        """, (user[-1],))  # Assuming RoleID is the last column in the Patrons table
        role = cursor.fetchone()
        role = role[0] if role else None
    else:
        role = None

    if role:
        cursor.execute("""SELECT PatronID FROM Patrons WHERE Username = ? AND Password = ?""", (username, password))
        userid = cursor.fetchone()
        userid = user[0] if user else None
    else:
        user = None
    
    conn.close()
    
    return user, role, userid
