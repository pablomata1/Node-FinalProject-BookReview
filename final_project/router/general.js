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

//Promise for getting books
const getAllBooksPromise = () => {
  return new Promise((resolve, reject) => {
    resolve(books); 
  }); 
}

const getBookISBNPromise = (ISBN) => {
  return new Promise((resolve, reject) => {
    //Checks if object property exists, if true resovles book property
    //Else rejects it with error message
    if(books[ISBN]){
      resolve(books[ISBN]);
    } else{
      reject('books is not available')
    }
  })
}

const getBookAuthorPromise = (author) => {
  return new Promise((resolve, reject) => {
    let authorBooks = []; 
    for (let book in books){
      if((books[book].author).toLowerCase() === author){
        authorBooks.push(books[book]);
        }
    }
    // Check to see if there is any results
    if(authorBooks.length > 0){
      resolve(authorBooks);
    } else {
      reject(`No books under author: '${author}' `);
    }
    
  });
}

const getBooksTitlePromise = (title) => {
 return new Promise((resolve, reject) => {
   //Find title from the list of books
  //Iterrate thru object 'books
  let titleBooks = []; 
  for (let book in books){
    if((books[book].title).toLowerCase() === title){
      titleBooks.push(books[book]);
    }
  }

  if(titleBooks.length > 0){
    resolve(titleBooks);
  } else {
    reject(`No books found under title: '${title}'`);
  }
 });

}

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Syntax for  JSON.stringify(value[, replacer[, space]]);
  // res.send(JSON.stringify(books, null, 4));

  //Using Promise
  getAllBooksPromise().then(resolve => {
    res.send(resolve)
  }).catch(err => {
    return res.status(404).json({Error: err});
  })

});


// Get book details based on ISBN - using Async Await Promise 
public_users.get('/isbn/:isbn', async (req, res) => {
  //Get isbn from params in req obj
  const ISBN = req.params.isbn;
  
  //Try catch for any error, way to catch error with async await
  try {
    //awaits the response from promise
      const data = await getBookISBNPromise(ISBN);
      res.send(data);
  } catch (err) {
    res.send('error: ' + err);
  }

})

// Get Book Details Based On Author - using Async Await Promise
public_users.get('/author/:author', async (req, res) => {
  //Get author from params in req object
  const author = (req.params.author).toLowerCase();

  //try catch for error handling from await promise
  try {
    //store resolve section of promise from 'getBookAuthorPromise'
    const authorBookList = await getBookAuthorPromise(author);
    res.send(authorBookList)
  } catch (err) {
    res.send('error: ' + err);
  }

});

//GET ALL BOOKS BASED ON TITLE - USING ASYNC AWAIT PROMISE
public_users.get('/title/:title', async (req, res) => {
  //Get title from params 
  const title = (req.params.title).toLowerCase();

  try {
    const bookList = await getBooksTitlePromise(title);
    res.send(bookList);
  } catch (err) {
    res.send('error: ' + err);
  }

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

//SAME METHOD AS ABOVE WITHOUT ASYNC AWAIT PROMISE

// Get Book Details Based On ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Get isbn from params in req object
//   const ISBN = req.params.isbn;
//   if(ISBN > 0 && ISBN < 11){
//     res.send(books[ISBN]);
//   } else{
//     res.send('No book found')
//   }

//  });


// Get Book Details Based On Author
// public_users.get('/author/:author',function (req, res) {
//   //Get author from params in req object
//   const author = (req.params.author).toLowerCase();

//   //Find author from the list of books
//   //Iterrate thru object 'books
//   let authorBooks = []; 
//   for (let book in books){
//     if((books[book].author).toLowerCase() === author){
//       authorBooks.push(books[book]);
//     }
//   }

//   res.send(authorBooks);

// });


// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   //Get title from params in the req object
//   const title = (req.params.title).toLowerCase();

//   //Find title from the list of books
//   //Iterrate thru object 'books
//   let titleBooks = []; 
//   for (let book in books){
//     if((books[book].title).toLowerCase() === title){
//       titleBooks.push(books[book]);
//     }
//   }

//   res.send(titleBooks);
  
// });



module.exports.general = public_users;
