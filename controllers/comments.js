const express = require('express');
const router = express.Router();

const Thread = require('../models/threads.js');
const User = require('../models/users.js');
const Comment = require('../models/comments.js')

module.exports = router;

// Read - GET (index - all comments)
router.get('/', (req, res) => {
    Comment.find({}, (err, foundComments) => {
        res.json(foundComments);
    });
});

// Read (Single Comment) - GET
router.get('/:id', (req, res) => {
    Comment.findById(req.params.id, (err, foundComment) => {
        res.json(foundComment);
    });
});

// GET all comments for a user
router.get('/user/:userId', (req, res) => { 
    let userId = req.params.userId
    Comment.find( {"userRef": userId}, (err, foundComments) => { 
        res.json(foundComments);
    })
})

// Create - POST 
router.post('/', (req, res) => { 

    let currentUser = req.session.currentUser;
    req.body.userRef = currentUser._id;
    req.body.username = currentUser.username;
    
    let threadId = req.body.threadRef;
    
    Comment.create( req.body, (err, createdComment) => { 
        Thread.findById(threadId, (err, foundThread) => { 
            foundThread.comments.push(createdComment);
            foundThread.save( (err, data) => { 
                res.status(200).json(createdComment)
            });
        });
    });
    
})

//Delete - DESTROY
router.delete('/:id', (req, res) => { 
    let commentToDeleteId = req.params.id;
    Comment.findByIdAndRemove( commentToDeleteId, (err, deletedComment) => { 
        Thread.findOne( {'comments._id' : commentToDeleteId}, (err, foundThread) => { 
            foundThread.comments.id(commentToDeleteId).remove();
            foundThread.save( (err, data) => { 
                res.status(200).json(deletedComment);
            })
        })
    })
})

//Update - PUT
router.put('/:id', (req, res) => { 
    let commentToUpdateId = req.params.id;
    Comment.findByIdAndUpdate(commentToUpdateId, req.body, {new : true}, (err, updatedComment) => { 
        Thread.findOne( {'comments._id' : commentToUpdateId}, (err, foundThread) => { 
            let origIndex = foundThread.comments.findIndex( (e) => { 
                return e._id.equals(updatedComment._id)
            })

            foundThread.comments.id(commentToUpdateId).remove();
            foundThread.comments.splice(origIndex, 0, updatedComment);
            foundThread.save( (err, data) => { 
                res.status(200).json(updatedComment);
            })
        })
    })
})