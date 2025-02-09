
/* Customer Routes */

// GET Homepage
exports.homepage = async (req, res) => {
    const locals ={
        title: 'Home Page',
        description: 'Welcome to our homepage'
    }
    res.render('index', locals);
}
