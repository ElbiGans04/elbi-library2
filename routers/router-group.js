module.exports = function (model, name) {
    const ModuleTemplate = require('../controllers/module');
    const  moduleLibrary = new ModuleTemplate();
    const respon = require('../controllers/respon');
    const {Op} = require('sequelize');


    this.db = require('../db/models/index');
    this.model = model;


    this.get = async (req, res, next) => {
        try {
            // Import Model
            let model = await this.db;
            const paramID = req.params.id;
            
            const result = await model[this.model].findOne({
                where: {
                    id: paramID
                }
            });
    
            if(!result) throw new respon({message: 'not found', code: 200, alert: true});
    
            // Jika ada    
            res.json(new respon({message: 'success', data: result, type: true, alert: true, code: 200, show: true}));
    
        } catch (err) {
            next(err)
        }
    };


    this.getAll = async ( req, res, next ) => {
        try {
        
            // Import Model
            const model = this.db
    
            // Cari user yang rolenya bukan admin maupun librarian
            let allClass = await model[this.model].findAll();

            // ambil name
            let about = model['about'];
            let {appName} = await about.findOne({
                raw: true,
                attributes: ['appName']
            });
            
            // Ambil Column
            let coloumn = Object.keys(await model[this.model].rawAttributes);
    
            // Column yang tidak ingin ditampilkan
            const without = ['id', 'createdat', 'updatedat'];
    
    
            // Render halaman
            res.render('table', {
                appName,
                coloumn: coloumn,
                data: allClass,
                profile: req.user,
                modalwithout: [...without],
                without: [...without, 'role'],
                title: name,
                module: moduleLibrary,
                as: [
                    moduleLibrary.as({target: 'name', as: 'identifer'})
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
            next(err)
        }
    }


    // Post
    this.post = async (req, res, next) => {
        try {
            // Import Model
            let model = await this.db;
            

            // If Name not found
            if(!req.body.name) throw new respon({message: 'invalid', code: 200, alert: true})

            // Check Jika sudah ada
            let validate = await model[this.model].count({
                where: {
                    name: req.body.name
                }
            });
        
            if(validate > 0) throw new respon({message: 'already', code: 200, alert: true});
    
            // Buat 
            await model[this.model].create(req.body);

            // Kirim Respon Jika berhasil
            let url = req.originalUrl.split('/')[1];
            res.json(new respon({message: 'successfully added', type: true, alert: true, code: 200, show: true, redirect: `/${url}`}));
    
        } catch (err) {
            next(err)
        }
    };




    // // Put \\ \\
    this.put = async (req, res, next) => {
        try {
            // Import Model
            const model = await this.db;
            const paramID = req.params.id;
    
            const result = await model[this.model].findOne({
                where: {
                    id: paramID
                },
                attributes: ['name'],
                raw: true
            });
    
            //  Jika ga ada
            if(!result) throw new respon({message: 'not found', code: 200, alert: true})


            if(!req.body.name) throw new respon({message: 'name cannot be empty', code: 200, alert: true})
            
            // Cari apakah bedasarkan nama ada yang sama
            let validate2 = await model[this.model].count({
                where: {
                    name: req.body.name,
                    id: {
                        [Op.not] : paramID
                    }
                }
            });

            // Jika sudah ada
            if(validate2 > 0) throw new respon({message: 'already', code: 200, alert: true});

            // Update
            await model[this.model].update(req.body, {
                where: {
                    id : paramID
                }
            });
    
            // Kirim Respon
            let url = req.originalUrl.split('/')[1];
            res.json(new respon({message: 'updated successfully', type: true, alert: true, code: 200, show: true, redirect: `/${url}`}))
    
        } catch (err) {
            next(err)
        }
    };





    // Delete
    this.delete = async (req, res, next) => {
        try {
             // Import Model
            const model = await this.db;
            const paramID = req.params.id;
           
            const result = await model[this.model].count({
                    where: {
                        id: paramID
                    }
            }); 
            
            if(result < 0) throw new respon({message: 'not found', alert: true, code: 200});
    
            await model[this.model].destroy({
                where: {
                    id: paramID
                }
            });

            let url = req.originalUrl.split('/')[1];
            res.json(new respon({message: 'successfully deleted', type: true, alert: true, code: 200, show: true, redirect: `/${url}`}));
        } catch (err) {
            next(err)
        }
    }
}