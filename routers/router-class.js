const express = require('express');
const Route = express.Router();
let model = require('../models/model-index');
const ModuleTemplate = require('../controllers/module');
const  moduleLibrary = new ModuleTemplate();
const respon2 = require('../controllers/respon');
const respon = require('../controllers/respon');


Route.get('/:id', async function(req, res){
    try {
            // Import Model
            const { userClass } = await model();
            const paramID = req.params.id;
            
            const result = await userClass.findOne({
                where: {
                    id: paramID
                }
            });

            if(!result) throw new respon({message: 'user not found'});

            // Jika ada
            
            res.json(new respon({message: 'success', data: result}))

    } catch (err) {
        console.log(err);
        const code = err.code || 200;
        res.status(code).json(err);
    }
});

Route.get('/*', async function ( req, res ) {
    try {
    
        // Import Model
        const { userClass } = await model();

        // Cari user yang rolenya bukan admin maupun librarian
        let allClass = await userClass.findAll();
        
        // Ambil Column
        let coloumn = Object.keys(await userClass.rawAttributes);

        // Column yang tidak ingin ditampilkan
        const without = ['id', 'createdat', 'updatedat'];


        // Render halaman
        res.render('table', {
            coloumn: coloumn,
            data: allClass,
            role: req.user.role,
            modalwithout: [...without],
            without: [...without, 'role'],
            title: 'Class',
            active: 'class',
            module: moduleLibrary,
            name: req.user.email,
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
});


// Post

Route.post('/', async function(req, res){
    try {
        console.log(req.originalUrl)
        // Import Model
        const { userClass } = await model();
        
        // Check Jika sudah ada
        let validate = await userClass.count({
            where: {
                name: req.body.name
            }
        });
    
        if(validate > 0) throw new respon({message: 'class already', code: 200});

        // Buat 
        await userClass.create(req.body);

        // Kirim Respon Jika berhasil
        res.json(new respon({message: 'managed to add class', type: true}));

    } catch (err) {
        console.log(err)
        const code = err.code || 200;
        res.status(code).json(err)
    }
});

// Put
Route.put('/:id', async function(req, res){
    try {
        // Import Model
        const { userClass } = await model();
        const paramID = req.params.id;

        const result = await userClass.count({
            where: {
                id: paramID
            }
        });

        //  Jika ga ada
        if(result < 0 ) throw new respon({message: 'not found', code: 200})

        // Update
        await userClass.update(req.body, {
            where: {
                id : paramID
            }
        });

        // Kirim Respon
        res.json(new respon({message: 'successfully updated the class', type: true}))

    } catch (err) {
        console.log(err)
        const code = err.code || 200;
        res.status(code).json(err)
    }
});


Route.delete('/:id', async function(req, res){
    try {
         // Import Model
        const { userClass } = await model();
        const paramID = req.params.id;
       
        const result = await userClass.count({
                where: {
                    id: paramID
                }
        }); 
        
        if(result < 0) throw new respon({message: 'user not found'});

        await userClass.destroy({
            where: {
                id: paramID
            }
        });

        res.json({message: 'success', code: 200, type: true})
    } catch (err) {
        console.log(err);
        const code = err.code || 200;
        res.status(code).json(err)
    }
})

module.exports = Route