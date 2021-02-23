let model = require('../db/models/index')
const ModuleTemplate = require('./module');
const  moduleLibrary = new ModuleTemplate();
const respon2 = require('./respon')
const url = require('url');

module.exports = {
    get : async function(req, res,next) {
        try {
            const id = req.params.id;

            
            // Auth
            let result = await model.user.findOne({
                where: {
                    id
                }
            });
        
            if(!result) throw new respon2({message: 'user not found', code: 200});
    
            // Jika Ada maka Kirimkan
            res.json(new respon2({message: 'success',data: result, type: true, alert: true, code: 200, show: true}))
    
        } catch ( err ) {
            next(err)
        }
    },


    // Get All
    getAll : async function (req, res, next) {
        try {
            let alluser;

            // Cari user yang rolenya bukan admin maupun librarian
            let {group} = url.parse(req.url, true).query;
            if(group === undefined || group.toLowerCase() == "all") alluser = await model.user.findAll();
            else {
                let resultOfClass = await model.class.findOne({
                    where: {
                        id: group
                    }
                });

                // Jika tidak ada
                if(!resultOfClass) alluser = await model.user.findAll();  
                else {
                    alluser = await resultOfClass.getUsers();
                }
            }

            // ambil name
            let about = model.about;
            let {appName} = await about.findOne({
                raw: true,
                attributes: ['appName']
            });
            
            
            // Ambil Data dari tabel relasi
            for (let el of alluser) {
                let classCustom = await el.getClasses({
                    raw: true,
                    attributes: ['id', [`name`, 'title']]
                });
                
                el.dataValues.user_class = classCustom[0];
            }
            

            // Ambil Class untuk modal select
            let resultClass = await model.class.findAll({
                raw: true,
                attributes: ['id', ['name', 'value']]
            });
            
            
            // Ambil Column
            let coloumn = Object.keys(await model.user.rawAttributes);
            coloumn.push('class')

            // Column yang tidak ingin ditampilkan
            const without = ['id', 'createdat', 'updatedat'];


            // Render halaman
            res.render('table', {
                appName,
                coloumn: coloumn,
                data: alluser,
                profile: req.user,
                modalwithout: [...without],
                without: [...without, 'role'],
                title: 'User',
                module: moduleLibrary,
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
            next(err)
        }
    },



    // Post
    post: async function(req, res, next){
        try {
            // Vadidation 
            // Check Apakah user dengan email terkait telah terdaftar
            let validation = await model.user.findOne({
                where : {
                    nisn : req.body.nisn
                }
            });
            
            // Jika Ada
            if (validation > 0) throw new respon2({code: 200, message: 'nisn already'});

            let resultClass = await model.class.findOne({
                where: {
                    id: req.body.class
                }
            });

            if (!resultClass) throw new respon2({code: 200, message: 'invalid class'})

            // // Buat User sesuai yang diinputkan
            let resultUser = await model.user.create(req.body, {});
            await resultUser.setClasses(resultClass);
            
            // Kirim Respon kepada user
            res.json(new respon2({message: 'successfully added', type: true, alert: true, code: 200, show: true}))
    
        } catch (err) {
            next(err);
        }
    },


    // Put
    put: async function (req, res, next) {
        try {
            let entitasId = req.params.id;
    
            // Validation
            // Check Apakah user dengan id terkait ditemukan
            let validation = await model.user.findOne({
                where: {
                    id: entitasId
                }
            });

            // Jika user tidak ditemukan maka lempar pesan
            if(validation <= 0) throw new respon2({message: 'user not found', code: 200})

            let resultClass = await model.class.findOne({
                where: {
                    id: req.body.class
                }
            });

            if (!resultClass) throw new respon2({code: 200, message: 'invalid class'})
    
    
            // Jika Ditemukan maka lanjutkan
            let result = await model.user.update(req.body, {
                where: {
                    id: entitasId
                }
            });

            await validation.setClasses(resultClass)
    
            
            // Kirim Tanggapan
            res.json(new respon2({message: 'updated successfully', type: true, alert: true, code: 200, show: true}))
    
        } catch (err) {
            next(err)
        }
    },


    // Delete
    delete: async function (req, res, next) {
        try {
            let id = req.params.id;
            
            // Validation
            let validation = await model.user.count({
                where: {
                    id
                },
                raw: true
            });
    
            // Jika TIdak terdapat user
            if ( validation <= 0 ) throw new respon2({message: 'user not found', code: 200});
    
            // Hapus user
            await model.user.destroy({
                where: {
                    id
                }
            })
            
            res.json(new respon2({message: 'successfully deleted', type: true, alert: true, code: 200, show: true}));
            
        } catch (err) {
            next()
        }
    }
};