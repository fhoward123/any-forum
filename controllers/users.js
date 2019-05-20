const express = require('express');
const router = express.Router();

//Require bcrypt - hash+salt passwords
const bcrypt = require('bcrypt');

//Mongoose Data Model
const User = require('../models/users.js');

//Creates a new user with username and password
router.post('/', (req, res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    User.create(req.body, (err, createdUser) => {
        if (createdUser) {
            res.status(201).json({
                status: 201,
                message: "user created"
            });
        }
        else {
            console.log('error creating user: ', err.message);
            res.status(400).json({
                status: 400,
                message: err.message
            })
        }
    });
});

// Read - GET - a single user
router.get('/:id', (req, res) => { 
    User.findById( req.params.id, (err, foundUser) => { 
        res.status(200).json(foundUser);
    });
});

// Update - PUT - change user details
router.put('/:id', (req, res) => { 
    
    if(req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    }
    User.findByIdAndUpdate( req.params.id, req.body, {new:true}, (err, updatedUser) => { 
        res.status(200).json(updatedUser);
    });    
});


module.exports = router;
