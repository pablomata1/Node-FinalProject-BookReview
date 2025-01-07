const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Get username and password from body
  const username = req.body.username;
  const password = req.body.password;

  //Check if username and password is provided
  if(username && password){
    //Check if the user does not already exist
    if(!isValid(username)){
      //add the new user to the users array
      users.push({username: username, password: password});
      return res.status(200).json({message: 'User successfully registered. Now you can login'})
    } else {
      return res.status(404).json({message: 'User already exists!.'})
    }
  } else {
    return res.status(404).json({message: 'Unable to register user.'})
  }

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Syntax for  JSON.stringify(value[, replacer[, space]]);
  res.send(JSON.stringify(books, null, 4));

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Get isbn from params in req object
  const ISBN = req.params.isbn;
  if(ISBN > 0 && ISBN < 11){
    res.send(books[ISBN]);
  } else{
    res.send('No book found')
  }

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Get author from params in req object
  const author = (req.params.author).toLowerCase();

  //Find author from the list of books
  //Iterrate thru object 'books
  let authorBooks = []; 
  for (let book in books){
    if((books[book].author).toLowerCase() === author){
      authorBooks.push(books[book]);
    }
  }

  res.send(authorBooks);

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Get title from params in the req object
  const title = (req.params.title).toLowerCase();

  //Find title from the list of books
  //Iterrate thru object 'books
  let titleBooks = []; 
  for (let book in books){
    if((books[book].title).toLowerCase() === title){
      titleBooks.push(books[book]);
    }
  }

  res.send(titleBooks);
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //get isbn from params in req obj
  const ISBN = req.params.isbn;

  if(ISBN > 0 && ISBN < 11){
    //Get books reviews based on ISBN
  res.send(books[ISBN].reviews);
  } else{
    res.send('No book found for reviews')
  }
 

});

module.exports.general = public_users;
