require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const connectDB = require('./server/config/db');

const app = express();
const port = process.env.PORT || 3000;

//Connect to MongoDB
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Static Files
app.use(express.static('public'));

//Session Setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7 //1 week
    }
}));

//Flash Message
app.use(flash({ sessionKeyName: 'flashMessage' }));

//Template Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//Routes
app.use('/', require('./server/routes/customer'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

//Handle 404
app.get('*', (req, res) => {
    res.status(404).render('404');
})