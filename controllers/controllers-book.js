let model = require('../models/model-index');
const {auth} = require('./module');
module.exports = {
    getAll: async function (req, res) {
        try {
            if(await auth(req, 'admin') == true) {
                const { book } = await model();
                const result = await book.findAll();
                res.render('table', {
                    data: result,
                    coloumn: Object.keys(await book.rawAttributes),
                    without:['id', 'createdat', 'updatedat'],
                    title: 'Book',
                    active: 'book',
                    module: require('./module'),
                    buttonAdd: 'fas fa-book mr-2'
                })
            }
        } catch (err) {
            console.log(err.message)
            const code = err.code || 500;
            res.status(code).json(err)
        }
    },

    post: async function (req,res) {
        try {
            let { book } = await model();
    
            // Verification
            if(await auth(req, 'admin') == true) {
                // Vadidation 
                let validation = await book.findAll({
                    where : {
                        book_title
                         : req.body.book_title

                    },
                    raw: true
                });
        
                // Jika Tidak Ada
                if (validation.length > 0) throw new respon2({code: 200, message: new Error('user already')});
                let result = await book.create(req.body);
                
                res.json(new respon2({message: 'successfully added members'}))
            }
    
        } catch (err) {
            console.log(err.message)
            const code = err.code || 500;
            res.status(code).json(err)
        }
    }
}