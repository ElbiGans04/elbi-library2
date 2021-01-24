module.exports = function (app) {
    const port = process.env.APP_PORT || 3000;
    const controllersMember = require('../controllers/controllers-member');
    const member = require('./router-member');
    const book = require('./router-book');
    app.get('/', function(req, res){
        res.send('this is home page')
    });
    
    app.use('/members', member)
    app.use('/books', book)

    // Register And Logout
    app.get('/register', function(req, res){
        res.render('register')
    })
    app.post('/register', controllersMember.register);
    app.get('/login', function(req, res){
        res.render('login')
    })
    app.post('/login', controllersMember.login);
    app.get('/logout', controllersMember.logout)
    
    
    app.listen(port, function(err) {
        if (err) throw err;
        console.log(`Server telah dijalankan pada port ${port}`)
    })
}