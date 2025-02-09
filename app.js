require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const connectDB = require('./server/config/db');

const app = express();
const port = process.env.PORT || 3000;

//Connect to MongoDB
connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Static Files
app.use(express.static('public'));

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