module.exports = function (model, name) {
    const ModuleTemplate = require('../controllers/module');
    const  moduleLibrary = new ModuleTemplate();
    const respon = require('../controllers/respon');


    this.db = require('../db/models/index');
    this.model = model;


    this.get = async (req, res) => {
        try {
            // Import Model
            let model = await this.db;
            const paramID = req.params.id;
            
            const result = await model[this.model].findOne({
                where: {
                    id: paramID
                }
            });
    
            if(!result) throw new respon({message: 'not found'});
    
            // Jika ada    
            res.json(new respon({message: 'success', data: result, code: 200}))
    
        } catch (err) {
            console.log(err);
            const code = err.code || 200;
            res.status(code).json(err);
        }
    };


    this.getAll = async ( req, res ) => {
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
            console.log(err)
            const code = err.code || 200;
            const message = err.message.message || err.message
            res.status(code).send(message)
        }
    }


    // Post
    this.post = async (req, res) => {
        try {
            // Import Model
            let model = await this.db;
            
            // Check Jika sudah ada
            let validate = await model[this.model].count({
                where: {
                    name: req.body.name
                }
            });
        
            if(validate > 0) throw new respon({message: 'already', code: 200});
    
            // Buat 
            await model[this.model].create(req.body);
    
            // Kirim Respon Jika berhasil
            res.json(new respon({message: 'managed to add', type: true, code: 200}));
    
        } catch (err) {
            console.log(err)
            const code = err.code || 200;
            res.status(code).json(err)
        }
    };




    // // Put \\ \\
    this.put = async (req, res) => {
        try {
            // Import Model
            const model = await this.db;
            const paramID = req.params.id;
    
            const result = await model[this.model].count({
                where: {
                    id: paramID
                }
            });
    
            //  Jika ga ada
            if(result < 0 ) throw new respon({message: 'not found', code: 200})
    
            // Update
            await model[this.model].update(req.body, {
                where: {
                    id : paramID
                }
            });
    
            // Kirim Respon
            res.json(new respon({message: 'successfully updated the group', type: true}))
    
        } catch (err) {
            console.log(err)
            const code = err.code || 200;
            res.status(code).json(err)
        }
    };





    // Delete
    this.delete = async (req, res) => {
        try {
             // Import Model
            const model = await this.db;
            const paramID = req.params.id;
           
            const result = await model[this.model].count({
                    where: {
                        id: paramID
                    }
            }); 
            
            if(result < 0) throw new respon({message: 'not found'});
    
            await model[this.model].destroy({
                where: {
                    id: paramID
                }
            });
    
            res.json({message: 'successfully deleted', code: 200, type: true})
        } catch (err) {
            console.log(err);
            const code = err.code || 200;
            res.status(code).json(err)
        }
    }
}