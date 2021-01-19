module.exports = async function (app) {
    try {
        const port = process.env.APP_PORT || 3000;
        const modelIndex = require('../models/model-index');
        const db = modelIndex();
        
        const controllersMember = require('../controllers/controller-member')
    
        app.get('/', function(req, res){
            res.render('index')
        });
    
        app.get('/member', function(req, res){
            res.send('THis is member')
        })
        
        app.listen(port, function(err) {
            if (err) throw err;
            console.log(`Server telah dijalankan pada port ${port}`)
        })
    } catch (err) {
        if (err) res.status(500).send(err.message);
    }
}