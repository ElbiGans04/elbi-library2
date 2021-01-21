module.exports = function (app) {
    const port = process.env.APP_PORT || 3000;
    const controllersMember = require('../controllers/controller-member')
    const tabel = require('../models/model-index');
    app.get('/', function(req, res){
        res.send('this is home page')
    });

    app.get('/member', controllersMember.getAll);
    app.get('/member/:id', controllersMember.get);
    app.post('/member', controllersMember.post);
    app.put('/member/:id', controllersMember.put);
    app.delete('/member/:id', controllersMember.delete);
    

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