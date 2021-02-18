let model = require('../models/model-index');
const ModuleTemplate = require('./module');
const  moduleLibrary = new ModuleTemplate();
const respon2 = require('./respon')
const url = require('url');


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
        
            if(!result) throw new respon2({message: 'user not found', code: 200});
    
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
            let { user, userClass} = await model();
            let alluser;

            // Cari user yang rolenya bukan admin maupun librarian
            let {group} = url.parse(req.url, true).query;
            if(group === undefined || group.toLowerCase() == "all") alluser = await user.findAll();
            else {
                let resultOfClass = await userClass.findOne({
                    where: {
                        id: group
                    }
                });

                // Jika tidak ada
                if(!resultOfClass) alluser = await user.findAll();  
                else {
                    alluser = await resultOfClass.getUsers()
                }
            }
            
            
            // Ambil Data dari tabel relasi
            for (let el of alluser) {
                let classCustom = await el.getClasses({
                    raw: true,
                    attributes: ['id', [`name`, 'title']]
                });
                
                el.dataValues.user_class = classCustom[0];
            }
            

            // Ambil Class untuk modal select
            let resultClass = await userClass.findAll({
                raw: true,
                attributes: ['id', ['name', 'value']]
            });
            
            
            // Ambil Column
            let coloumn = Object.keys(await user.rawAttributes);
            coloumn.push('class')

            // Column yang tidak ingin ditampilkan
            const without = ['id', 'createdat', 'updatedat'];


            // Render halaman
            res.render('table', {
                coloumn: coloumn,
                data: alluser,
                role: req.user.role,
                modalwithout: [...without],
                without: [...without, 'role'],
                title: 'User',
                module: moduleLibrary,
                name: req.user.email,
                as: [
                    moduleLibrary.as({target: 'name', as: 'identifer'}),
                    moduleLibrary.as({target: 'nisn', type: 'number'}),
                    moduleLibrary.as({target: 'class',showName: 'class', type: 'select', value: resultClass}),
                    
                ],
                buttonHeader: {
                    add: {
                      class: 'fas fa-user mr-2',
                      id: 'addActionButton'
                    },
                },
                group: resultClass,
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
            let { user, userClass } = await model();
            
            // Vadidation 
            // Check Apakah user dengan email terkait telah terdaftar
            let validation = await user.findOne({
                where : {
                    nisn : req.body.nisn
                }
            });
            
            // Jika Ada
            if (validation > 0) throw new respon2({code: 200, message: 'nisn already'});

            let resultClass = await userClass.findOne({
                where: {
                    id: req.body.class
                }
            });

            if (!resultClass) throw new respon2({code: 200, message: 'invalid class'})

            // // Buat User sesuai yang diinputkan
            let resultUser = await user.create(req.body, {});
            await resultUser.setClasses(resultClass);
            
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
            let { user, userClass } = await model();
            let entitasId = req.params.id;
    
            // Validation
            // Check Apakah user dengan id terkait ditemukan
            let validation = await user.findOne({
                where: {
                    id: entitasId
                }
            });

            // Jika user tidak ditemukan maka lempar pesan
            if(validation <= 0) throw new respon2({message: 'user not found', code: 200})

            let resultClass = await userClass.findOne({
                where: {
                    id: req.body.class
                }
            });

            if (!resultClass) throw new respon2({code: 200, message: 'invalid class'})
    
    
            // Jika Ditemukan maka lanjutkan
            let result = await user.update(req.body, {
                where: {
                    id: entitasId
                }
            });

            await validation.setClasses(resultClass)
    
            
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
            let validation = await user.count({
                where: {
                    id
                },
                raw: true
            });
    
            // Jika TIdak terdapat user
            if ( validation <= 0 ) throw new respon2({message: 'user not found', code: 200});
    
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