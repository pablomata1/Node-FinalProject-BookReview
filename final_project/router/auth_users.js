const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //Filter the users array for any user with the same username
  let userswithsamename = users.filter(user => user.username === username);

  //Return true if any user with the same username is found, otherwise false
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

  //Filter users array for any user with same username and password
  let validUsers = users.filter(user => user.username === username && user.password === password);

  //Return true if any valid user is found, otherwise return false
  if(validUsers.length > 0){
    return true;
  } else {
    return false;
  } 

}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Get username and password from req body
  const username = req.body.username;
  const password = req.body.password;

  //Check if username or password is missing
  if(!username || !password){
    return res.status(404).json({message: 'Error logging in'});
  }

  //Authencticate user
  if(authenticatedUser(username, password)){
    //Generate JWT token
    //Token includes payload, token secret, and configuration object
    let accesstoken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60*60});

    //Store access token and username in session 
    req.session.authorization = {
      accesstoken, username
    }
    return res.status(200).json({ message: 'User successfully logged in'});
  } else {
    return res.status(200).json({message: 'Invalid Login. Check username and password'});
  }




});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Get username from session 
  const username = req.session.authorization['username'];

  //Get isbn from param req object
  const ISBN = req.params.isbn;

  //Get query parameters
  const review = req.query.review;

  //Access book based on ISBN
  if(ISBN > 0 && ISBN < 11){
    //Add or Update review
     //To find user review just access the property of the books object, no need to search

    books[ISBN].reviews[username] = review;
    res.send(books[ISBN]);
 
  } else{
    res.send('No book found for reviews')
  }

});

//Delete review users review from book based on ISBN
regd_users.delete('/auth/review/:isbn', (req, res) => {
  //Get isbn from req object param
  const ISBN = req.params.isbn;
 
  //Get username from session
  const username = req.session.authorization['username'];

  //Find users review and delete
  //To find user review just access the property of the books object, no need to search
  if(ISBN > 0 && ISBN < 11){
    //Add or Update review
    if(books[ISBN].reviews[username]){
      delete books[ISBN].reviews[username];
      return res.json({message: `${username} review successfully deleted`, [ISBN]: books[ISBN]});
    } else {
      return res.send('No user review found!')
    }
 
  } else{
    res.send('No ISBN found!')
  }


});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
