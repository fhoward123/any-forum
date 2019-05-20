const express = require('express');
const router = express.Router();

const Thread = require('../models/threads.js');
const User = require('../models/users.js');

module.exports = router;

// Read (Index) - GET
router.get('/', (req, res) => {
    Thread.find({}, (err, foundThreads) => {
        res.json(foundThreads);
    });
});

// Read (Single Thread) - GET
router.get('/:id', (req, res) => {
    Thread.findById(req.params.id, (err, foundThread) => {
        res.json(foundThread);
    });
});

// Get ALL threads for a given user
router.get('/user/:userId', (req, res) => { 
    let userId = req.params.userId;
    Thread.find( { "userRef" : userId}, (err, foundThreads) => { 
        res.json(foundThreads)
    } )
})

// Create - POST
router.post('/', (req, res) => { 
    
    let currentUser = req.session.currentUser;
    req.body.userRef = currentUser._id;
    req.body.username = currentUser.username;
    req.body.userImg = currentUser.img;

    Thread.create( req.body, (err, createdThread) => { 
        res.status(200).json(createdThread);
    });
})

// Delete - DELETE
router.delete('/:id', (req, res) => { 
    Thread.findByIdAndRemove(req.params.id, (err, deletedThread) => { 
        res.status(200).json(deletedThread);
    })
})

// Update - PUT
// router.put('/:id', (req, res) => { 
//     Thread.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedThread) => { 
//         res.status(200).json(updatedThread);
//     })
// })

//Test Like update - PUT
router.put('/:id', (req, res) => { 
    Thread.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedThread) => { 
        if(updatedThread.likeUsers) {
            let numLikes = Object.keys(updatedThread.likeUsers).length;
            updatedThread.likes = numLikes;
        }
        updatedThread.save( (err, data) => { 
            res.status(200).json(updatedThread);
        })
    })
})
