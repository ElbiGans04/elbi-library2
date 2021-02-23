const express = require('express');
const Route = express.Router();
let model = require('../db/models/index')
const ModuleTemplate = require('../controllers/module');
const  moduleLibrary = new ModuleTemplate();
const respon = require('../controllers/respon');
let url = require('url');

Route.get('/', async function(req, res){ 
    try {
        // Cari role
        let allClass = await model.role.findOne({
            where: {
                name: 'admin'
            }
        });

        // Jika user sekarang mempunyai role admin maka tampilkan petugas dengan role admin
        // Jika dia mempunyai role librarian maka tampilkan semua
        let resultOfficer;
        let {group} = url.parse(req.url, true).query;
        if(group === undefined || group.toLowerCase() == "all") resultOfficer = req.user.role == 'admin' ? await allClass.getOfficers() : await model.officer.findAll();
        else {
            let resultOfClass = await model.role.findOne({
                where: {
                    id: group
                }
            });
            
            // Jika tidak ketemu
            if(!resultOfClass) resultOfficer = req.user.role == 'admin' ? await allClass.getOfficers() : await model.officer.findAll();
            else {
                resultOfficer = req.user.role == 'admin' ? await allClass.getOfficers()  : await resultOfClass.getOfficers()
            }
        };

            // ambil name
            let about = model.about;
            let {appName} = await about.findOne({
                raw: true,
                attributes: ['appName']
            });
        
        // ambil untuk modal 
        let opt = req.user.role == 'admin' ? {name: `admin`} : {};
        let resultRole = await model.role.findAll({
            where: opt,
            raw: true,
            attributes: ['id', ['name', 'value']]
        });

        // Ambil Nama dari assosiasi
        for (let el of resultOfficer) {
            let role = await el.getRoles({
                raw: true,
                attributes: ['id', ['name', 'title']]
            });

            el.dataValues.role = role[0]
        }

        
        // Ambil Column
        let coloumn = Object.keys(await model.officer.rawAttributes);
        coloumn.push('role');
        

        // Column yang tidak ingin ditampilkan
        const without = ['id', 'createdat', 'updatedat', 'officer_role'];

        // Render halaman
        res.render('table', {
            appName,
            coloumn,
            data: resultOfficer,
            profile: req.user,
            modalwithout: [...without],
            without: [...without],
            title: 'Officer',
            module: moduleLibrary,
            as: [
                moduleLibrary.as({target: 'name', as: 'identifer'}),
                moduleLibrary.as({target: 'role', as: 'group', type: 'select', value: resultRole}),
                moduleLibrary.as({target: 'password', default: 'off'}),
                moduleLibrary.as({target: 'email', type: "email"}),
                
            ],
            group: resultRole,
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

Route.get('/:id', async function(req, res){
    try {   
        const userID = req.params.id;

        // Check
        let roleAdmin = await model.role.findOne({
            where: {
                name: 'admin'
            }
        });

        let opsi = {
            where: {
                id: userID
            },
            raw: true
        }

        let result = req.user.role == 'admin' ? await roleAdmin.getOfficers(opsi) : await model.officer.findAll(opsi);
        result = result[0];

        if(!result) throw new respon({message: 'user not found', code: 200});
    
        // Jika Ada maka Kirimkan
        res.json(new respon({message: 'success', code: 200, data: result}));
    } catch (err) {
        console.log(err);
        const code = err.code || 200;
        res.status(code).json(err);
    }
});

Route.post('/', async function(req, res){
    try {
        const { email } = req.body;
        
        // Check
        const validate = await model.officer.count({
            where: {
                email
            }
        });

        // Hashing
        req.body.password = moduleLibrary.hashing(req.body.password);
        
        // Jika email sudah terdaftar
        if(validate > 0) throw new respon({message: 'email already register', code: 200});

        const validateRole = await model.role.findOne({
            where: {
                id: req.body.role
            }
        });

        // Jika role undifined
        if(!validateRole) throw new respon({message: 'role is invalid', code: 200});

        // Jika admin menambahkan role librarian
        if(req.user.role == 'admin' && validateRole.name == 'librarian') throw new respon({message: 'you dont have permission', code: 200});

        // Tambahkan
        let result = await model.officer.create(req.body);
        await result.setRoles(validateRole)
        
        res.json(new respon({message: 'managed to add officers', code: 200, type: true}))
    } catch (err) {
        console.log(err);
        const code = err.code || 200;
        res.status(code).json(err)
    }
});

Route.put('/:id', async function(req, res){
    try {
        const userId = req.params.id;

        // Check
        const validate = await model.officer.findOne({
            where: {
                id: userId
            }
        });

        // Validate 
        if(validate < 0) throw new respon({message: 'not found', code: 200});


        // Check Role
        const validateRole = await model.role.findOne({
            where: {
                id: req.body.role
            }
        });
        
        // Jika role undifined
        if(!validateRole) throw new respon({message: 'role is invalid', code: 200});

        // Jika admin menambahkan role librarian
        if(req.user.role == 'admin' && validateRole.name == 'librarian') throw new respon({message: 'you dont have permission', code: 200});    
        
        // Hashing
        req.body.password = moduleLibrary.hashing(req.body.password);

        await model.officer.update(req.body, {
            where: {
                id: userId
            }
        });
        await validate.setRoles(validateRole);

        res.json({message: 'successfully updated the attendant', type: true})
    
    } catch (err) {
        console.log(err);
        const code = err.code || 200;
        res.status(code).json(err)
    }
});

Route.delete('/:id', async function(req, res){
    try {
        const userId = req.params.id;
        
        const result = await model.officer.findOne({
            where: {
                id: userId
            }
        });

        let resultRole = await result.getRoles({
            raw: true
        })

        // Jika user tidak ketemu
        if(!result) throw new respon({message: 'not found', code: 200});

        // Jika admin ingin menghapus librarian
        if(req.user.role == 'admin' && resultRole[0].name == 'librarian') throw new respon({ message : 'you dont have permission', code: 200})

        await model.officer.destroy({
            where : {
                id: userId
            }
        });

        res.json({message: 'managed to remove the officer', type: true})
    
    } catch (err) {
        console.log(err);
        const code = err.code || 200;
        res.status(code).json(err)
    }
})

module.exports = Route