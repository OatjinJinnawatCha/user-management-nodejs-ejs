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

    try {
        const customers = await Customer.aggregate([{ $sort: { updatedAt: -1 } }])
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec();
        const count = await Customer.countDocuments();

        res.render('index', {
            locals,
            customers,
            current: page,
            pages: Math.ceil(count / perPage),
            messages
        });
    } catch (error) {
        console.log(error);
    }
};

// GET Add Customer
exports.addCustomer = async (req, res) => {
    const locals = {
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

exports.viewCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id });
        const locals = {
            title: 'View Customer',
            description: 'View Customer Details',
        }
        res.render('customer/view', {
            locals,
            customer
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.editCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOne({ _id: req.params.id });
        const locals = {
            title: 'Edit Customer',
            description: 'Edit Customer Details',
        }
        res.render('customer/edit', {
            locals,
            customer
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.putEditCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndUpdate({ _id: req.params.id }, {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            telephoneNum: req.body.telephoneNum,
            email: req.body.email,
            detail: req.body.detail,
            updatedAt: Date.now()
        });
        await req.flash('info', 'Customer updated successfully');
        res.redirect('/');
    }
    catch (error) {
        console.log(error);
    }
}

exports.deleteCustomer = async (req, res) => {
    try {
        await Customer.findByIdAndDelete({ _id: req.params.id });
        await req.flash('info', 'Customer deleted successfully');
        res.redirect('/');
    }
    catch (error) {
        console.log(error);
    }
}

exports.searchCustomer = async (req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
        const customers = await Customer.find({
            $or: [
                { firstName: { $regex: new RegExp(searchNoSpecialChar), $options: 'i' } },
                { lastName: { $regex: new RegExp(searchNoSpecialChar), $options: 'i' } },
            ]
        });
        const locals = {
            title: 'Search Customer',
            description: 'Search Customer',
        }
        res.render('search', {
            customers,
            locals
        });
    }
    catch (error) {
        console.log(error);
    }
}

exports.about = async (req, res) => {
    const locals = {
        title: 'About',
        description: 'Welcome to our homepage'
    };
    try {
        res.render('about', {
            locals,
        });
    } catch (error) {
        console.log(error);
    }
};