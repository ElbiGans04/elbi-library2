let model = require('../models/model-index');
const respon2 = require('./respon2');
const {ambilKata, as, pesanError} = require('./module');
const path = require('path');
module.exports = {
    get: async function(req, res) {
        try {
            let { book } = await model();
            const id = req.params.id;
            
            // Auth
            let result = await book.findOne({
                where: {
                    id
                }
            });

            result.dataValues.book_image = result.dataValues.book_image.toString('base64')
        
            if(result.length <= 0) throw new respon2({message: 'book not found', code: 200});
    
            // Jika Ada maka Kirimkan
            res.json(new respon2({message: 'success', code: 200, data: result}));
            
        } catch ( err ) {
            const code = err.code || 500;
            const message = err.message.message || err.message
            res.status(code).send(message)
        }
    },

    getAll: async function (req, res) {
        try {
            const { book } = await model();
            const result = await book.findAll();
            res.render('table', {
                data: result,
                coloumn: Object.keys(await book.rawAttributes),
                without:['id', 'createdat', 'updatedat', 'book_type'],
                modalwithout:['id', 'createdat', 'updatedat', 'book_type'],
                as: [
                    new as({target: 'book_image', type: 'file', without: [0]}),
                    new as({target: 'book_title', as: 'identifer', without: [0]})
                ],
                title: 'Book',
                active: 'book',
                module: require('./module'),
                buttonHeader: {
                    add: {
                        class: 'fas fa-book mr-2',
                        id: 'addActionButton'
                    }
                },
                buttonAction: {
                    delete: true,
                    update: true
                }
            })

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
            // Vadidation 
            let validation = await book.findAll({
                where : {
                    book_title
                     : req.body.book_title

                },
                raw: true
            });

            // Buat File Format

            let format = path.extname(req.file.originalname);
            format = format.split('.')[1];
            req.body.book_type = format

            // Tambahkan File, Karena file berada direq.file
            req.body.book_image = req.file.buffer;
    
            // Jika Tidak Ada
            if (validation.length > 0) throw new respon2({code: 200, message: new Error('book already')});
            let result = await book.create(req.body);
            
            res.json(new respon2({message: 'successfully added book'}))

        } catch (err) {
            console.log(err)
            if(err instanceof Error) {
                if(err.errors) err.message = pesanError(err)
                else if(err.message == `Cannot read property 'originalname' of undefined`) err.message = 'please insert image'
                err = new respon2({message: err.message, code:200});
            }
            const code = err.code || 200;
            res.status(code).json(err)
        }
    },

    put: async function (req, res) {
        try {
            let { book } = await model();
            let entitasId = req.params.id;
    
            // Verify
            // Validation
            let validation = await book.findAll({
                where: {
                    id: entitasId
                },
                raw: true
            });
    
            // Jika book tidak ditemukan
            if(validation.length <= 0) throw new respon2({message: 'book not found', code: 200})

            
            // Tambahkan File, Karena file berada direq.file
            if(req.file) {
                // Buat File Format

                let format = path.extname(req.file.originalname);
                format = format.split('.')[1];
                req.body.book_type = format
                req.body.book_image = req.file.buffer;
            }

            // Jika Ditemukan maka lanjutkan
            await book.update(req.body, {
                where: {
                    id: entitasId
                }
            })
    
    
            res.json(new respon2({message: 'success', type: true}))
    
        } catch (err) {
            console.log(err)
            if(err instanceof Error) {
                if(err.errors) err.message = pesanError(err)
                else if(err.message == `Cannot read property 'originalname' of undefined`) err.message = 'please insert image'
                err = new respon2({message: err.message, code:200});
            }
            const code = err.code || 200;
            res.status(code).json(err)
        }
    },

    delete: async function (req, res) {
        try {
            let { book } = await model();
            let id = req.params.id;
            
            // Verify
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
            
        } catch (err) {
            console.log(err)
            const code = err.code || 500;
            res.status(code).send(err)
        }
    }
}