const express = require('express');
const router = express.Router();
//Require bcrypt - compare hashed + salted passwords to login input
const bcrypt = require('bcrypt');

const User = require('../models/users.js');

module.exports = router;


//Check current session user
// router.get('/currentUser', (req,res) => {
//     res.json(req.session.currentUser);
// });

//Checks if password is correct on login
    //if correct, save a currentUser property in the req.session
router.post('/', (req, res) => {
    User.findOne({ username: req.body.username }, (err, foundUser)=>{
        if (!foundUser){
            res.status(401).json({
                status: 401,
                message: 'login failed'                
            });
        }
        else if(bcrypt.compareSync(req.body.password, foundUser.password) ){
            req.session.currentUser = foundUser;
            res.status(201).json({
                status: 201,
                message: 'session created',
                loggedInUser: foundUser
            });
        } else {
            res.status(401).json({
                status: 401,
                message: 'login failed'                
            });
        }
    });
});

// Triggered by logout button
    //"destroy" the current session aka log out
router.delete('/', (req,res) => {
    req.session.destroy((err)=> {
        res.status(200).json({
            status: 200,
            message: 'logout complete'
        });
    });
});