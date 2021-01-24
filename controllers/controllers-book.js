let model = require('../models/model-index');
const respon2 = require('./respon2');
const {auth} = require('./module');
module.exports = {
    get: async function(req, res) {
        try {
            let { book } = await model();
            const id = req.params.id;
            
            // Auth
            if(await auth(req, 'admin') == true) {
                let result = await book.findOne({
                    where: {
                        id
                    }
                });
            
                if(result.length <= 0) throw new respon2({message: 'book not found', code: 200});
        
                // Jika Ada maka Kirimkan
                res.json(new respon2({message: 'success', code: 200, data: result}));
            }
    
            
        } catch ( err ) {
            const code = err.code || 500;
            const message = err.message.message || err.message
            res.status(code).send(message)
        }
    },

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
            console.log(req.body)
    
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
                if (validation.length > 0) throw new respon2({code: 200, message: new Error('book already')});
                let result = await book.create(req.body);
                
                res.json(new respon2({message: 'successfully added book'}))
            }
    
        } catch (err) {
            console.log(err.message)
            const code = err.code || 500;
            res.status(code).json(err)
        }
    },

    put: async function (req, res) {
        try {
            console.log(req.body)
            let { book } = await model();
            let entitasId = req.params.id;
    
            // Verify
            if(await auth(req, 'admin') == true) {
                // Validation
                let validation = await book.findAll({
                    where: {
                        id: entitasId
                    },
                    raw: true
                });
        
                // Jika book tidak ditemukan
                if(validation.length <= 0) throw new respon2({message: 'book not found', code: 200})
    
                // Jika Ditemukan maka lanjutkan
                await book.update(req.body, {
                    where: {
                        id: entitasId
                    }
                })
        
        
                res.json(new respon2({message: 'success', type: true}))
            }
    
        } catch (err) {
            const code = err.code || 500;
            const message = err.message.message || err.message
            res.status(code).send(message)
        }
    },

    delete: async function (req, res) {
        try {
            let { book } = await model();
            let id = req.params.id;
            
            // Verify
            if(await auth(req, 'admin') == true) {
                // Validation
                let validation = await book.findAll({
                    where: {
                        id
                    },
                    raw: true
                });
        
                // Jika TIdak terdapat user
                if ( validation.length <= 0 ) throw new respon2({message: 'book not found', code: 200});
        
                // Hapus book
                await book.destroy({
                    where: {
                        id
                    }
                })
                
                res.json(new respon2({message: 'successfully deleted book'}))
            }
            
        } catch (err) {
            console.log(err)
            const code = err.code || 500;
            res.status(code).send(err)
        }
    }
}