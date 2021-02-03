let model = require('../models/model-index');
const ModuleTemplate = require('./module');
const  moduleLibrary = new ModuleTemplate();
const respon2 = require('./respon2')



module.exports = {
    get : async function(req, res) {
        try {
            let { member } = await model();
            const id = req.params.id;

            
            // Auth
            let result = await member.findOne({
                where: {
                    id
                }
            });
        
            if(result.length <= 0) throw new respon2({message: 'member not found', code: 200});
    
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
            let { member, Op } = await model();
            let allMember = await member.findAll({
                where: {
                    [Op.not] : {
                        role: ['admin', 'librarian']
                    }
                }
            });
            let {role: userRole} = req.user;
            let role = [{id: 'user', value: 'user'}];
            if(userRole == 'librarian' || userRole == 'admin') {
                role.push({id: 'admin', value: 'admin'})
            }
            
            let coloumn = Object.keys(await member.rawAttributes);
            const without = ['id', 'createdat', 'updatedat'];

            res.render('table', {
                coloumn: coloumn,
                data: allMember,
                role: userRole,
                modalwithout: [...without],
                without: [...without, 'role'],
                title: 'Member',
                active: 'member',
                module: moduleLibrary,
                as: [
                    moduleLibrary.as({target: 'email', as: 'identifer'}),
                    moduleLibrary.as({target: 'role', type: 'select', value: role}),
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
            const code = err.code || 200;
            const message = err.message.message || err.message
            res.status(code).send(message)
        }
    },



    // Post
    post: async function(req, res){
        try {
            // Load Modal member
            let { member } = await model();
            // Ambil Role dari cookie
            let {role: userRole} = req.user;
            
            // Vadidation 
            // Check Apakah user dengan email terkait telah terdaftar
            let validation = await member.findAll({
                where : {
                    email : req.body.email
                },
                raw: true
            });
            
            // Jika Ada
            if (validation.length > 0) throw new respon2({code: 200, message: 'user already'});
            // Jika ada yang menambahkan user dengan role librarian maka lempar pesan
            if(req.body.role.toLowerCase() == 'librarian') throw new respon2({code: 200, message: 'You do not have permission to add a user with that role'})
            // jika user dengan role user mencoba menambahkan user maka lempar pesan
            if(userRole == 'user') throw new respon2({code: 200, message: 'You do not have permission to add a user with that role'})


            // Buat User sesuai yang diinputkan
            let result = await member.create(req.body, {});
            
            // Kirim Respon kepada user
            res.json(new respon2({message: 'successfully added members'}))
    
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
            let { member } = await model();
            let entitasId = req.params.id;
    
            // Validation
            // Check Apakah user dengan id terkait ditemukan
            let validation = await member.findAll({
                where: {
                    id: entitasId
                },
                raw: true
            });
    
            // Jika user tidak ditemukan maka lempar pesan
            if(validation.length <= 0) throw new respon2({message: 'member not found', code: 200})
    
            // Jika Ditemukan maka lanjutkan
            await member.update(req.body, {
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
            let { member } = await model();
            let id = req.params.id;
            
            // Validation
            let validation = await member.findAll({
                where: {
                    id
                },
                raw: true
            });
    
            // Jika TIdak terdapat user
            if ( validation.length <= 0 ) throw new respon2({message: 'member not found', code: 200});
    
            // Hapus member
            await member.destroy({
                where: {
                    id
                }
            })
            
            res.json(new respon2({message: 'successfully deleted member'}))
            
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
};