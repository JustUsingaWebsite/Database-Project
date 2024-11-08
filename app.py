from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
import time
import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'python'))
from auth import authenticate_user
from GET import fetch_all_data
from POST import loan_book, add_book, add_loan
from UPDATE import UpdateLoan, UpdateBook
import asyncio

app = Flask(__name__)
app.secret_key = 'your_secret_key'

# HOME ROOT SECTION

@app.route('/')
def home():
    if 'username' in session:
        match session['role'].lower():  # Ensure case consistency
            case 'admin':
                return redirect(url_for('admin'))
            case 'librarian':
                return redirect(url_for('librarian'))
            case 'patron':
                return redirect(url_for('patron_home'))
    return render_template('index.html')

# AUTHENTICATE SECTION

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    user, role, id = authenticate_user(username, password)
    
    if user:
        session['username'] = username
        session['role'] = role
        session['id'] = id
        return redirect(url_for('home'))
    else:
        flash("Invalid username or password")
        time.sleep(1)
        return redirect(url_for('home'))
    
# LOGOUT SECTION

@app.route('/logout')
def logout():
    session.pop('username', None)
    session.pop('role', None)  # Also clear role from session
    flash("You have been logged out")
    return redirect(url_for('home'))

# API SECTION

@app.route('/api/session')
def session_data():
    if 'username' in session:
        returnval = {'username': session['username'], 'role': session['role'], 'id': session['id']}
        return jsonify(returnval)
    else:
        return jsonify({'error': 'No session data'}), 401

@app.route('/api/data')
def api_data():
    data = fetch_all_data()
    return jsonify(data)  # Return JSON response

@app.route('/api/loanbook', methods=['POST'])
def loan_book_route():
    data = request.json
    patron_id = data.get('patronID')
    isbn = data.get('isbn')
    loan_date = data.get('loanDate')

    return loan_book(patron_id, isbn, loan_date)


@app.route('/api/returnbook', methods=['POST'])
def return_book_route():
    data = request.json
    isbn = data.get('isbn')
    return_date = data.get('date')
    Loanid = data.get('loanid')

    return UpdateLoan(Loanid, session['id'], None, None, return_date)

@app.route('/api/book/add', methods=['POST'])
def add_book_route():
    data = request.json
    isbn = data.get('isbn')
    title = data.get('title')
    authors = data.get('authors')
    categories = data.get('categories')
    year = data.get('yearOfPublication')
    copies = data.get('copies')

    return add_book(isbn, title, authors, categories, year, copies)

@app.route('/api/book/edit', methods=['POST'])
def update_book_route():
    data = request.json
    isbn = data.get('isbn')
    title = data.get('title')
    authors = data.get('authors')
    categories = data.get('categories')
    year = data.get('yearOfPublication')
    copies = data.get('copies')

    return UpdateBook(isbn, title, year, copies, authors, categories)


@app.route('/api/loan/add', methods=['POST'])
def add_loan_route():
    data = request.json
    isbn = data.get('isbn')
    patron = data.get('patron')
    start_date = data.get('startdate')
    return_date = data.get('returndate')

    # Use asyncio.run to call the async function
    response, status_code = asyncio.run(add_loan(patron, isbn, start_date, return_date))
    return response, status_code

@app.route('/api/loan/edit', methods=['POST'])
def update_loan_route():
    data = request.json
    loanid = data.get('loanid')
    isbn = data.get('isbn')
    patron = data.get('patron')
    start_date = data.get('startdate')
    return_date = data.get('returndate')
    print(loanid, isbn, patron, start_date, return_date)

    return UpdateLoan(loanid, patron, isbn, start_date, return_date)




# PATRON ROUTING SECTION

@app.route('/patron')
def patron_home():
    if 'username' not in session:
        flash("You must log in first")
        return redirect(url_for('home'))
    return render_template('homepagePatron.html')

@app.route('/books')
def books():
    if 'username' not in session:
        flash("You must log in first")
        return redirect(url_for('home'))
    return render_template('bookspagePatron.html')

@app.route('/loans')
def loans():
    if 'username' not in session:
        flash("You must log in first")
        return redirect(url_for('home'))
    return render_template('loanspagePatron.html')


# Librarian Routing Section

@app.route('/librarian')
def librarian():
    if 'username' not in session:
        flash("You must log in first")
        return redirect(url_for('home'))
    return render_template('homepageLibrarian.html')

@app.route('/bookManagement')
def book_management():
    if 'username' not in session:
        flash("You must log in first")
        return redirect(url_for('home'))
    return render_template('bookmanagementLibrian.html')

@app.route('/loanManagement')
def loan_management():
    if 'username' not in session:
        flash("You must log in first")
        return redirect(url_for('home'))
    return render_template('loansmanagementLibrian.html')

#Add/Edit Section
@app.route('/add_edit')
def add_edit():
    if 'username' not in session:
        flash("You must log in first")
        return redirect(url_for('home'))
    return render_template('add-edit-bookLibrian.html')

#Admin Routing Section

@app.route('/admin')
def admin():
    if 'username' not in session:
        flash("You must log in first")
        return redirect(url_for('home'))
    return render_template('homepageAdmin.html')

@app.route('/patronManagement')
def patron_management():
    if 'username' not in session:
        flash("You must log in first")
        return redirect(url_for('home'))
    return render_template('patronmanagementAdmin.html')



# Error handler section test changes

@app.errorhandler(403)
def unauthorized(e):
    return render_template('error.html', message="You are not authorized to view this page"), 403

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
    #app.run(debug=True)