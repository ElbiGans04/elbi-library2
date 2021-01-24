module.exports = function (app) {
    const port = process.env.APP_PORT || 3000;
    const controllersMember = require('../controllers/controllers-member');
    const controllersBook = require('../controllers/controllers-book');
    const tabel = require('../models/model-index');
    app.get('/', function(req, res){
        res.send('this is home page')
    });

    app.get('/members', controllersMember.getAll);
    app.get('/members/:id', controllersMember.get);
    app.post('/members', controllersMember.post);
    app.put('/members/:id', controllersMember.put);
    app.delete('/members/:id', controllersMember.delete);
    
    // Books
    app.get('/books', controllersBook.getAll)
    app.post('/books', controllersBook.post)

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