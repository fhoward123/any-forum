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

// Create - POST
router.post('/', (req, res) => { 
    console.log('hit post');

    let userId = req.session.currentUser._id;
    req.body.userRef = userId;

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
router.put('/:id', (req, res) => { 
    Thread.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedThread) => { 
        res.status(200).json(updatedThread);
    })
})

{
// // Create - POST
// router.post('/', (req, res) => {
//     let userId = req.session.currentUser._id
//     console.log(userId);
//     req.body.userId = userId;
//     User.findById( userId, (err, foundUser) => {
//         Bookmark.create( req.body, (err, createdBookmark) => {
//             foundUser.bookmarks.push(createdBookmark);
//             foundUser.save( (err, data) => {
//                 res.json(createdBookmark);
//             })    
//         });
//     } )
// });

// // Delete - DELETE
// router.delete('/:id', (req, res) => {
//     Bookmark.findByIdAndRemove( req.params.id, (err, deletedBookmark) => {
//         console.log('Received delete for: '+req.params.id);

//         User.findOne( {'bookmarks._id' : req.params.id}, (err, foundUser) => {
//             foundUser.bookmarks.id(req.params.id).remove();
//             foundUser.save( (err, data) => {
//                 res.json(deletedBookmark);
//             });
//         });
        
//     });
// });

// // Update - PUT
// router.put('/:id', (req, res) => {
//     console.log(req.body);
//     Bookmark.findByIdAndUpdate( req.params.id, req.body, {new:true}, (err, updatedBookmark) => {
//         User.findOne({ "bookmarks._id" : req.params.id }, (err, foundUser) => {
//             let origIndex = foundUser.bookmarks.findIndex( (e)=> {
//                 return e._id.equals(updatedBookmark._id)
//             });

//             foundUser.bookmarks.id(req.params.id).remove();
//             foundUser.bookmarks.splice(origIndex, 0, updatedBookmark);
//             foundUser.save( (err, data) => {
//                 res.json(updatedBookmark);
//             })
//         })
//     });
// });
}
