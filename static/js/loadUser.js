async function loadUserInfo() {
    const response = await fetch('/api/data');
    const response2 = await fetch('/api/session');
    const data = await response.json();
    const sessionData = await response2.json();

    const username = sessionData.username;
    const role = sessionData.role.toLowerCase();

    // Role-based redirection
    if (role !== 'patron' && role !== 'librarian' && role !== 'admin') {
        console.error("Unknown role:", role);
        return;
    }

    // Get user-specific data
    let user;
    if (role === 'patron') {
        user = data.patrons.find(p => p.Username === username);
    } else if (role === 'librarian' || role === 'admin') {
        user = data.patrons.find(p => p.Username === username); // Adjust this based on your data structure
    }

    if (user) {
        const welcomeMessageEl = document.querySelector('.welcome-message');
        const profileInfoEl = document.querySelector('.profile-info');

        if (role === 'patron') {
            const currentLoans = data.loans.filter(loan => loan.PatronID === user.PatronID);
            const pendingLoans = currentLoans.filter(loan => !loan.ReturnDate).length;

            welcomeMessageEl.textContent = `Welcome, ${user.Name}!`;
            profileInfoEl.innerHTML = `
                <p><strong>Role:</strong> Patron</p>
                <p><strong>Total Pending Loans:</strong> ${pendingLoans}</p>
                <p><strong>Total Books Loaned:</strong> ${currentLoans.length}</p>
            `;
        } else if (role === 'librarian') {
            const totalBooks = data.books.length;
            const totalPatrons = data.patrons.filter(p => p.RoleID === 3).length; //3 is the patrons role id
            const totalLoans = data.loans.length;

            welcomeMessageEl.textContent = `Welcome, ${user.Name}!`;
            profileInfoEl.innerHTML = `
                <p><strong>Role:</strong> Librarian</p>
                <p><strong>Total Books:</strong> ${totalBooks}</p>
                <p><strong>Total Patrons:</strong> ${totalPatrons}</p>
                <p><strong>Total Loans:</strong> ${totalLoans}</p>`;

        } else if (role === 'admin') {
            const totalBooks = data.books.length;
            const totalLibrarians = data.patrons.filter(p => p.RoleID === 2).length;
            const totalCustomers = data.patrons.filter(p => p.RoleID === 3).length;
            const totalLoans = data.loans.length;

            welcomeMessageEl.textContent = `Welcome, ${user.Name}!`;
            profileInfoEl.innerHTML = `
                <p><strong>Role:</strong> Admin</p>
                <p><strong>Total Books:</strong> ${totalBooks}</p>
                <p><strong>Total Librarians:</strong> ${totalLibrarians}</p>
                <p><strong>Total Patrons:</strong> ${totalCustomers}</p>
                <p><strong>Total Loans:</strong> ${totalLoans}</p>
            `;
        }
    }
}

// Call loadUserInfo when the page loads
window.onload = loadUserInfo;
