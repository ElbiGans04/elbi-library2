let model = require('../models/model-index');
const ModuleTemplate = require('./module');
const  moduleLibrary = new ModuleTemplate();
const respon2 = require('./respon')



module.exports = {
    get : async function(req, res) {
        try {
            let { user } = await model();
            const id = req.params.id;

            
            // Auth
            let result = await user.findOne({
                where: {
                    id
                }
            });
        
            if(result.length <= 0) throw new respon2({message: 'user not found', code: 200});
    
            // Jika Ada maka Kirimkan
            res.json(new respon2({message: 'success', code: 200, data: result}));
    
        } catch ( err ) {
            console.log(err)
            if(err instanceof Error) {
                if(err.errors) err.message = moduleLibrary.pesanError(err)
                err = new respon2({message: err.message, code:200});
            }
            const code = err.code || 200;
            res.status(code).json(err)
        }
    },


    // Get All
    getAll : async function (req, res) {
        try {
            // Ambil Model
            let { user} = await model();

            // Cari user yang rolenya bukan admin maupun librarian
            let alluser = await user.findAll();
            
            // Ambil Column
            let coloumn = Object.keys(await user.rawAttributes);

            // Column yang tidak ingin ditampilkan
            const without = ['id', 'createdat', 'updatedat'];


            // Render halaman
            res.render('table', {
                coloumn: coloumn,
                data: alluser,
                role: req.user.role,
                modalwithout: [...without],
                without: [...without, 'role'],
                title: 'user',
                active: 'user',
                module: moduleLibrary,
                name: req.user.email,
                as: [
                    moduleLibrary.as({target: 'email', as: 'identifer'})
                ],
                buttonHeader: {
                    add: {
                      class: 'fas fa-user mr-2',
                      id: 'addActionButton'
                    }
                },
                buttonAction: {
                    update: true,
                    delete: true
                }
            })
    
        } catch (err) {
            console.log(err)
            const code = err.code || 200;
            const message = err.message.message || err.message
            res.status(code).send(message)
        }
    },



    // Post
    post: async function(req, res){
        try {
            // Load Modal member
            let { user } = await model();
            
            // Vadidation 
            // Check Apakah user dengan email terkait telah terdaftar
            let validation = await user.findAll({
                where : {
                    email : req.body.email
                },
                raw: true
            });
            
            // Jika Ada
            if (validation.length > 0) throw new respon2({code: 200, message: 'user already'});

            // Buat User sesuai yang diinputkan
            await user.create(req.body, {});
            
            // Kirim Respon kepada user
            res.json(new respon2({message: 'successfully added user', type: true}))
    
        } catch (err) {
            console.log(err);
            if(err instanceof Error) {
                if(err.errors) err.message = moduleLibrary.pesanError(err)
                err = new respon2({message: err.message, code:200});
            }
            const code = err.code || 200;
            res.status(code).json(err)
        }
    },


    // Put
    put: async function (req, res) {
        try {
            let { user } = await model();
            let entitasId = req.params.id;
    
            // Validation
            // Check Apakah user dengan id terkait ditemukan
            let validation = await user.findAll({
                where: {
                    id: entitasId
                },
                raw: true
            });
    
            // Jika user tidak ditemukan maka lempar pesan
            if(validation.length <= 0) throw new respon2({message: 'user not found', code: 200})
    
            // Jika Ditemukan maka lanjutkan
            await user.update(req.body, {
                where: {
                    id: entitasId
                }
            })
    
            
            // Kirim Tanggapan
            res.json(new respon2({message: 'success', type: true}))
    
        } catch (err) {
            console.log(err);
            if(err instanceof Error) {
                if(err.errors) err.message = moduleLibrary.pesanError(err)
                err = new respon2({message: err.message, code:200});
            }
            const code = err.code || 200;
            res.status(code).json(err)
        }
    },


    // Delete
    delete: async function (req, res) {
        try {
            let { user } = await model();
            let id = req.params.id;
            
            // Validation
            let validation = await user.findAll({
                where: {
                    id
                },
                raw: true
            });
    
            // Jika TIdak terdapat user
            if ( validation.length <= 0 ) throw new respon2({message: 'user not found', code: 200});
    
            // Hapus user
            await user.destroy({
                where: {
                    id
                }
            })
            
            res.json(new respon2({message: 'successfully deleted user'}))
            
        } catch (err) {
            if(err instanceof Error) {
                if(err.errors) err.message = moduleLibrary.pesanError(err)
                err = new respon2({message: err.message, code:200});
            }
            const code = err.code || 200;
            res.status(code).json(err)
        }
    }
};