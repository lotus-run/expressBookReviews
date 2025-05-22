const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 100))
        res.send(JSON.stringify(books, null, 4));
    } catch (error) {
        res.status(500).send({ error: "Error fetching books" });
    }

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    // Simulate an asynchronous operation using a Promise
    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]); // Return book details if found
        } else {
            reject("Book not found"); // Handle missing ISBN gracefully
        }
    })
        .then(book => res.send(JSON.stringify(book, null, 4)))
        .catch(error => res.status(404).send({ error }));
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author = req.params.author;

    // Wrap the logic inside a Promise
    new Promise((resolve, reject) => {
        const book = Object.values(books).find(book => book.author === author);

        if (book) {
            resolve(book);  // If the book is found, resolve the Promise
        } else {
            reject(`Book not found for author ${author}`);  // Reject if not found
        }
    })
        .then(book => res.send(JSON.stringify(book, null, 4)))
        .catch(error => res.status(404).json({ message: error }));
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
    const title = req.params.title;
    new Promise((resolve, reject) => {
        const book = Object.values(books).find(book => book.title === title);

        if (book) {
            resolve(book);  // If the book is found, resolve the Promise
        } else {
            reject(`Book not found for title ${title}`);  // Reject if not found
        }
    })
        .then(book => res.send(JSON.stringify(book, null, 4)))
        .catch(error => res.status(404).json({ message: error }));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews));
});

module.exports.general = public_users;
