# Intro
This is a basic library system to demonstrate most if not all topics on <ins> **Intro to Databases**</ins>. Aslo features some topics from **Web Dev**, and **GUI**.

# Set Up
- `download python ` <br>
- `to see the images you will need a internet connection`
<br>

- **pip install**
```
flask
asyncio
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

> [!CAUTION]
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
## Admin



# Theory Used

# Problems