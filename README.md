# Intro
This is a basic library system to demonstrate most if not all topics on <ins> **Intro to Databases**</ins>. Aslo features some topics from **Web Dev**, and **GUI**.
To quick run the application makes line `280` and `281` readable by removing the '#' and adding one to line `279`.

# Set Up
- `download python ` <br>
- `SQLITE`
- `to see the images you will need a internet connection`
<br>

- **pip install**
```
flask
asyncio
```

you can either install using winget or download the [commandline binaries](https://www.sqlite.org/download.html) for your os
```
winget install sqlite
```
```
sqlite --version
```

> [!NOTE]
> asyncio might not be used in the future :no_mouth:.

# Usage 

## Patron
### Loan Books
as a patron you can loan as many books as you need.

> [!TIP]
> Notice the color at the top right of a loan this indicates the status of the loan. `#00FB0A` Green for under a week, `#FBF700`Yellow for over a week old, and `#DC4D4F` Red for over a month.

> [!IMPORTANT]
> When loaning a book the book's ***copies*** decrease as it is now in your possesion.

> [!WARNING]
> Note you **cannot** loan 2 of the same books, only 1 at a time.

[Loan Books [code source]](static/js/loadBooks.js)
[Loans [code source] ](static/js/loadLoans.js)

### Return Books
as a patron you can also return a book when you're finished.

> [!TIP]
> In your loans tab after you have loaned a book in your books tab you will see a ***return button***

> [!IMPORTANT]
> When returning a book the book's ***copies*** will increase as it is now it our possession.

[Return book [code source]](static/js/returnBook.js)

## Librarian

`Librarian [code source]`
- [for books](static/js/managebooks.js)
- [for loans](static/js/manageloans.js)
- [for patrons](static/js/managePatrons.js)


### Add Books
> [!NOTE]
> Simple enough you can create a new book
### Edit Books
> [!NOTE]
> Simple enough you can edit a books a title, year of publication, authors, categories, and copies
### Add Loans
> [!NOTE]
> Simple enough you can create a loan

> [!IMPORTANT]
>will appear in the loans tab of the user created for
### Edit Loans
> [!NOTE]
> Simple enough you can edit a loans owner, book borrowed, loandate and returndate
### Add Patrons
> [!NOTE]
> Simple enough you can create a patron
### Edit Patrons
> [!NOTE]
> Simple enough you can edit a patrons name or address or phone number or email or username or password (*not hashed*) or role
## Admin
`can do all the below:`
- [add](#add-books)
- [edit](#edit-books)
- [delete](#deletion)

`to all the below: `
```
patron
librarian
admin
```


# Theory Used
`Introduction to Databases`

- [x] Create
- [x] Insert
- [x] Update
- [x] Join
- [x] Sub Query
- [x] Normalization
- [x] Delete

**Plan to use**
```
Procedures
Functions
Triggers
```

`Web Dev`
- [x] styling
- [x] html structure
- [x] javascript
- [x] frameworks

`GUI`
- [x] backend code with python
- [x] frontend code with javascript
- [x] Flask framework for ease with **live-viewing changes**





# Problems

### Deletion
So I did add deletion which both librarian and admin can use but mainly admin.

But the problem is you would usually peek data in a database rather than delete it `unless a user wants his/her data removed.`

> [!WARNING]
> Only admins can delete patrons(*doesn't matter the role*)

> [!CAUTION]
> If you an admin delete your own account you will be logged out.

### Security

So security isn't the best here I mainly strived to get data accessable as possible that way I don't have to worry about debugging security and only implementations.

you can notice that your session data is free for you to see at [api/session](http://127.0.0.1:5000/api/session) or even all the data from the database in a json at [api/data](http://127.0.0.1:5000/api/data) :skull:.

There are some other methods that I used are a little better like using `LocalStorage` from the browser to hold `action`, `type`, and `id` of the user you want to perfrom that action and which type of action. [code source](static/js/add-edit.js)
