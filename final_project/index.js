const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Middleware to authenticate requests to "/customer/auth/*" endpoint
app.use("/customer/auth/*", function auth(req,res,next){
//Write the authenication mechanism here
    if(req.session.authorization){
        let token = req.session.authorization['accessToken'];
    
        //Verify the JWT token
        //method takes the extracted token, your JWT secret, and a callback as arguments
        jwt.verify(token, 'access', (errr, user) => {
            if(!user){
                req.user = user; // Set authenticated user data on the request object
                next(); //Proceed to next middleware
            } else{
                return res.status(404).json({message: 'User not authenticated'})
            }
            
        });
    } else {
        return res.status(403).json({message: 'Not logged In. Token not found'});
    }
});
 
const PORT =4000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
