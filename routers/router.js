module.exports = async function (app) {
    try {
        const port = process.env.APP_PORT || 3000;
        const modelIndex = require('../models/model-index');
        const { member } = await modelIndex();
        
        const controllersMember = require('../controllers/controller-member')
    
        app.get('/', function(req, res){
            res.render('index')
        });
    
        app.get('/member', controllersMember.getAll);
        app.get('/member/:id', controllersMember.get);
        app.post('/member', controllersMember.post);
        app.put('/member/:id', controllersMember.put);
        app.delete('/member/:id', controllersMember.delete);
        

        // Register
        app.post('/register', controllersMember.register);
        app.get('/logout', function(req, res){
            res.cookie('token', {}, {
                maxAge: -1000
            });

            console.log("Cookie Telah Dihapus");
            res.sendStatus(200)
        })
        
        
        app.listen(port, function(err) {
            if (err) throw err;
            console.log(`Server telah dijalankan pada port ${port}`)
        })
    } catch (err) {
        console.log(`\n\n\n \t\t\t err from router \n\n\n`)
    }
}