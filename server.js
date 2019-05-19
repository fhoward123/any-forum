const express = require('express');
const app = express();
const mongoose = require('mongoose');
const db = mongoose.connection;

// Environment Variables
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/forum'
const PORT = process.env.PORT || 3000
const secret = process.env.SECRET

//Express listener
app.listen(PORT, ()=> {
    console.log('Forum App listening...');
});

//////////////////////////////////
//          Mongoose
/////////////////////////////////
// Connect to Mongo
mongoose.connect(mongoURI, { useNewUrlParser: true },
    () => console.log('MongoDB connection established:', mongoURI)
);
// Error / Disconnection
db.on('error', err => console.log(err.message + ' is Mongod not running?'))
db.on('disconnected', () => console.log('mongo disconnected'))


///////////////////////////////////
//          Middleware
///////////////////////////////////
//app.use(express.urlencoded({ extended: false })) //still want this so we can easily parse form info when testing in postman (even though we aren't sending directly from forms as we did before)
app.use(express.json());                //parse JSON requests
app.use(express.static('public'));      //make public folder available

//Use express-session to track logins
const session = require('express-session');
app.use(session({
    secret: 'testsecret', //some random string
    resave: false,
    saveUninitialized: false
}));


//Route to threads controller
const threadController = require('./controllers/threads.js')
app.use('/threads', threadController);

//Route to comments controller
const commentsController = require('./controllers/comments.js');
app.use('/comments', commentsController);

//Route to users controller
const usersController = require('./controllers/users.js');
app.use('/users', usersController);

//route to sessions controller
const sessionsController = require('./controllers/sessions.js');
app.use('/sessions', sessionsController);

//404 error
app.get('*', (req, res) => {
    res.status(404).json('Sorry, page not found')
})