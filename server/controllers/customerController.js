const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// GET Homepage
exports.homepage = async (req, res) => {
    const messages = req.flash('info');
    const locals = {
        title: 'Home Page',
        description: 'Welcome to our homepage'
    };

    let perPage = 10;
    let page = req.query.page || 1;

    try{
        const customers = await Customer.aggregate([ { $sort: {updatedAt: 1}}])
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec();
        const count = await Customer.countDocuments();

        res.render('index',{
            locals,
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            messages
        });
    } catch(error){
        console.log(error);
    }
};

// exports.homepage = async (req, res) => {
//     const messages = req.flash('info');
//     const locals = {
//         title: 'Home Page',
//         description: 'Welcome to our homepage'
//     };

//     try{
//         const customers = await Customer.find({}).limit(22);
//         res.render('index', { locals, messages, customers });
//     } catch(error){
//         console.log(error);
//     }
// };


// GET Add Customer
exports.addCustomer = async (req, res) => {
    const locals ={
        title: 'Add New Customer',
        description: 'Add a new customer'
    }
    res.render('customer/add', locals);
}

// POST Add Customer
exports.postCustomer = async (req, res) => {
    const newCustomer = new Customer({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        telephoneNum: req.body.telephoneNum,
        email: req.body.email,
        detail: req.body.detail
    });

    try {
        await Customer.create(newCustomer);
        await req.flash('info', 'Customer added successfully');
        res.redirect('/');
    }
    catch (error) {
        console.log(error);
    }
}
