let model = require('../models/model-index');
const respon2 = require('./respon');
const ModuleTemplate = require('./module');
const  moduleLibrary = new ModuleTemplate();
const path = require('path');

// Export
module.exports = {
    get: async function(req, res) {
        try {
            let { book } = await model();
            const id = req.params.id;
            
            // Validation
            // Jika apakah ditemukan user dengan id tsb
            let result = await book.findOne({
                where: {
                    id
                }
            });
            
            // Jika tidak ditemukan
            if(result.length <= 0) throw new respon2({message: 'book not found', code: 200});

            // Jika ditemukan convert image ke base 64
            result.dataValues.book_image = result.dataValues.book_image.toString('base64')
        
    
            // Jika Ada maka Kirimkan
            res.json(new respon2({message: 'success', code: 200, data: result}));
            
        } catch ( err ) {
            console.log(err);
            if(err instanceof Error) {
                if(err.errors) err.message = moduleLibrary.pesanError(err)
                err = new respon2({message: err.message, code:200});
            }
            const code = err.code || 200;
            res.status(code).json(err)
        }
    },

    getAll: async function (req, res) {
        try {
            const { book } = await model();
            const result = await book.findAll();
            const {id, email, role} = req.user;


            // Render 
            res.render('table', {
                coloumn: Object.keys(await book.rawAttributes),
                data: result,
                role,
                modalwithout:['id', 'createdat', 'updatedat', 'book_type'],
                without:['id', 'createdat', 'updatedat', 'book_type'],
                title: 'Book',
                active: 'book',
                module: moduleLibrary,
                name : email,
                as: [
                    moduleLibrary.as({target: 'book_image', type: 'file', without: [0]}),
                    moduleLibrary.as({target: 'book_title', as: 'identifer', without: [0]})
                ],
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
            // check apakah buku dengan title tsb sudah ada
            let validation = await book.findAll({
                where : {
                    book_title
                     : req.body.book_title

                },
                raw: true
            });
            
            // Jika Ada
            if (validation.length > 0) throw new respon2({code: 200, message: 'book already'});

            // Buat File Format
            if(!req.file) {
                throw new respon2({code: 200, message: 'please insert image'})
            } else {
                let format = path.extname(req.file.originalname);
                format = format.split('.')[1];
                req.body.book_type = format
    
                // Tambahkan File, Karena file berada direq.file
                req.body.book_image = req.file.buffer;
            }
            
            // Buat
            await book.create(req.body);
            
            // Beri respone
            res.json(new respon2({message: 'successfully added book', type: true, code: 200}))

        } catch (err) {
            console.log(err)
            if(err instanceof Error) {
                if(err.errors) err.message = moduleLibrary.pesanError(err)
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
    
    
            res.json(new respon2({message: 'success', type: true, code: 200}))
    
        } catch (err) {
            console.log(err)
            if(err instanceof Error) {
                if(err.errors) err.message = moduleLibrary.pesanError(err)
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
            
            res.json(new respon2({message: 'successfully deleted book', type: true, code: 200}))
            
        } catch (err) {
            console.log(err);
            if(err instanceof Error) {
                if(err.errors) err.message = moduleLibrary.pesanError(err)
                err = new respon2({message: err.message, code:200});
            }
            const code = err.code || 200;
            res.status(code).json(err)
        }
    }
}