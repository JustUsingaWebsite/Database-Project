CREATE TABLE Roles (
    RoleID INT PRIMARY KEY AUTO_INCREMENT,
    RoleName VARCHAR(255)
);

CREATE TABLE Books (
    ISBN VARCHAR(13) PRIMARY KEY,
    Title VARCHAR(255),
    Author VARCHAR(255), -- Consider using a separate Authors table for many-to-many relationship
    Category VARCHAR(255), -- Consider using a separate Categories table
    YearOfPublication DATE,
    CopiesAvailable INT
);

CREATE TABLE Patrons (
    PatronID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255),
    Address VARCHAR(255),
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255),
    Username VARCHAR(255) UNIQUE,
    Password VARCHAR(255),
    RoleID INT,
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);

CREATE TABLE Loans (
    LoanID INT PRIMARY KEY AUTO_INCREMENT,
    PatronID INT,
    ISBN VARCHAR(13),
    LoanDate DATE,
    ReturnDate DATE,
    FOREIGN KEY (PatronID) REFERENCES Patrons(PatronID),
    FOREIGN KEY (ISBN) REFERENCES Books(ISBN)
);

-- If you want to use separate tables for Authors and Categories:
CREATE TABLE Authors (
    AuthorID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255)
);

CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255)
);

-- Create junction tables for many-to-many relationships:
CREATE TABLE BookAuthors (
    BookID VARCHAR(13),
    AuthorID INT,
    PRIMARY KEY (BookID, AuthorID),
    FOREIGN KEY (BookID) REFERENCES Books(ISBN),
    FOREIGN KEY (AuthorID) REFERENCES Authors(AuthorID)
);

CREATE TABLE BookCategories (
    BookID VARCHAR(13),
    CategoryID INT,
    PRIMARY KEY (BookID, CategoryID),
    FOREIGN KEY (BookID) REFERENCES Books(ISBN),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);