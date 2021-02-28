const express = require('express');
const Route = express.Router();
let model = require('../db/models/index')
const ModuleTemplate = require('../controllers/module');
const  moduleLibrary = new ModuleTemplate();
const respon = require('../controllers/respon');
let url = require('url');
const {Op} = require('sequelize');

Route.get('/', async function(req, res, next){ 
    try {
        
        // Definisikan kekuatan role
        let permission = {
            admin: [],
            librarian: ['admin'],
            root: ['admin', 'librarian']
        };
        let actionPermission = [];

        // Kondisi bedasarkan 3 role
        let opsi;
        if (req.user.role == 'librarian') opsi = ["librarian", "admin"];
        else if (req.user.role == "admin") opsi = "admin";
        else opsi = "root";

             
        // Definisikan allClass untuk mencari role, resultOfficer untuk menampung data, stdopsi untuk menampung kondisi pencarian
        let allClass = await model.role.findAll({
            where: {
                name: opsi
            }
        });
        let resultOfficer;
        let stdopsi = {
            where: {
                id: {
                    [Op.not] : req.user.id
                }
            }
        };
        

        // Jika user sekarang mempunyai role admin maka tampilkan petugas dengan role admin
        // Jika dia mempunyai role librarian maka tampilkan semua
        let {group} = url.parse(req.url, true).query;
        if(group === undefined || group.toLowerCase() == "all") {

            // Jika user role root
            if (req.user.role == 'root' ) resultOfficer = await model.officer.findAll(stdopsi);    
            else {

                // Jika role ditemukan
                if(allClass) {
                    // Check apakah role lebih dari satu
                    resultOfficer = allClass.length === 1 ? await allClass[0].getOfficers(stdopsi) : [...await allClass[0].getOfficers(stdopsi), ...await allClass[1].getOfficers(stdopsi)];
                } else {
                    resultOfficer = []
                }
            };
        } else {

            // Cari ROle yang mau ditampilkan
            let resultOfClass = await model.role.findOne({
                where: {
                    id: group
                }
            });
            
            // Jika tidak ketemu
            if(!resultOfClass) {

                // Jika user dengan role root
                if (req.user.role == 'root' ) resultOfficer = await model.officer.findAll(stdopsi);    
                else {
                    if(allClass) {
                        resultOfficer = allClass.length === 1 ? await allClass[0].getOfficers(stdopsi) : [...await allClass[0].getOfficers(stdopsi), ...await allClass[1].getOfficers(stdopsi)];
                    } else {
                        resultOfficer = []
                    }
                };
            }
            else {
                let name = resultOfClass.dataValues.name;
                
                // Jangan biarkan role librarian dan role admin mengakses role root
                if((name == 'root' && (req.user.role == 'librarian' || req.user.role == 'admin')) || name == 'librarian' && req.user.role == 'admin') {
                    if(allClass) {
                        resultOfficer = allClass.length === 1 ? await allClass[0].getOfficers(stdopsi) : [...await allClass[0].getOfficers(stdopsi), ...await allClass[1].getOfficers(stdopsi)];
                    } else {
                        resultOfficer = []
                    }
                } else {
                    resultOfficer = await resultOfClass.getOfficers(stdopsi)
                }
            }
        };

        // ambil name
        let about = model.about;
        let {appName} = await about.findOne({
            raw: true,
            attributes: ['appName']
        });
        
        // ambil untuk modal 
        let opt = {};
        if(req.user.role === 'root') opt = {};
        else if(req.user.role === 'librarian') {
            opt = {
                name : {
                    [Op.not] : `root`
                }
            }
        } else {
            opt = {
                name : 'admin'
            }
        }

        let resultRole = await model.role.findAll({
            where: opt,
            raw: true,
            attributes: ['id', ['name', 'value']]
        });

        // console.log(resultOfficer)
        // Ambil Nama dari assosiasi
        for (let el of resultOfficer) {
            let role = await el.getRoles({
                raw: true,
                attributes: ['id', ['name', 'title']]
            });

            el.dataValues.role = role[0];

            // Looping
            let action = moduleLibrary.termasuk(permission[req.user.role], role[0].title)
            actionPermission.push(action);
        };

        

        
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
            without: [...without, 'password'],
            title: 'Officer',
            module: moduleLibrary,
            as: [
                moduleLibrary.as({target: 'role', as: 'group', type: 'select', value: resultRole}),
                moduleLibrary.as({target: 'password', default: 'off'}),
                moduleLibrary.as({target: 'email', type: "email", as: 'identifer'}),
                
            ],
            group: resultRole,
            buttonHeader: {
                add: {
                  class: 'fas fa-user mr-2',
                  id: 'addActionButton'
                }
            },
            buttonAction: {
                permission: actionPermission,
                update: true,
                delete: true
            }
        })

    } catch (err) {
        next(err)
    }
});

Route.get('/:id', async function(req, res, next){
    try {   
        const userID = req.params.id;
        
        // Definisikan kekuatan role
        let permission = {
            admin: [],
            librarian: ['admin'],
            root: ['admin', 'librarian']
        };
        let actionPermission = [];

        // Check
        let stdopsi = {
            where: {
                id: userID
            }
        }

        let result = await model.officer.findOne(stdopsi);
        
        // Jika tidak ada
        if(!result) throw new respon({message: 'user not found', code: 200, alert: true});

        // Check Role
        let resultRole = await result.getRoles({raw: true});
        if(!moduleLibrary.termasuk(permission[req.user.role], resultRole[0].name)) throw new respon({message: 'you dont have permission', code: 200, alert: true});
        
        // Jika Ada maka Kirimkan
        res.json(new respon({message: 'success',data: result, type: true, alert: true, code: 200, show: true}))
    } catch (err) {
        next(err)
    }
});

Route.post('/', async function(req, res, next){
    try {
        const { email } = req.body;

        // Jika email ga ada
        if(!email) throw new respon({message: 'email not found', code: 200, alert: true})
        
        // Check
        const validate = await model.officer.count({
            where: {
                email
            }
        });

        // Hashing
        req.body.password = moduleLibrary.hashing(req.body.password);
        
        // Jika email sudah terdaftar
        if(validate > 0) throw new respon({message: 'email already register', code: 200, alert: true});

        const validateRole = await model.role.findOne({
            where: {
                id: req.body.role
            }
        });

        // Jika role undifined
        if(!validateRole) throw new respon({message: 'role is invalid', code: 200, alert: true});

        // Jika admin menambahkan role librarian
        if(req.user.role == 'admin' && (validateRole.name == 'root' || validateRole.name == 'librarian')) throw new respon({message: 'you dont have permission', code: 200, alert: true});
        if(req.user.role == 'librarian' && validateRole.name == 'root') throw new respon({message: 'you dont have permission', code: 200, alert: true});

        // Tambahkan
        let result = await model.officer.create(req.body);
        await result.setRoles(validateRole)
        
        res.json(new respon({message: 'successfully added', type: true, alert: true, code: 200, show: true, redirect: '/officer'}))
    } catch (err) {
        next(err)
    }
});

Route.put('/:id', async function(req, res, next){
    try {
        const userId = req.params.id;
        
        // Check
        const validate = await model.officer.findOne({
            where: {
                id: userId
            }
        });

        // Validate 
        if(validate < 0) throw new respon({message: 'not found', code: 200, alert: true});


        // Check Role
        if(!req.body.role) throw new respon({message: 'role not found', code: 200, alert: true});
        const validateRole = await model.role.findOne({
            where: {
                id: req.body.role
            }
        });
        
        // Jika role undifined
        if(!validateRole) throw new respon({message: 'role is invalid', code: 200, alert: true});


        // ambil class sebelum
        let resultRawClass = await validate.getRoles({
            raw: true,
        });
        
        // Jika admin menambahkan role librarian
        // ValidateROle memastikan role ada atau tidak && resultRaw adalah class sebelumnya
        if(
            (req.user.role == 'admin' && (resultRawClass[0].name == 'root' || resultRawClass[0].name == 'librarian' || resultRawClass[0].name == 'admin')) ||
            (req.user.role == 'librarian' && ((resultRawClass[0].name == 'root' || resultRawClass[0].name == 'librarian') || (validateRole.name == 'root')))
            // (req.user.role == 'root' && resultRawClass[0].name == 'root' )
        ) throw new respon({message: 'you dont have permission', code: 200, alert: true});    
        
        // Hashing
        req.body.password = moduleLibrary.hashing(req.body.password);
        

        // // Update
        // await model.officer.update(req.body, {
        //     where: {
        //         id: userId
        //     }
        // });
        // await validate.setRoles(validateRole);

        res.json(new respon({message: 'updated successfully', type: true, alert: true, code: 200, show: true, redirect: '/officer'}))
    
    } catch (err) {
        next(err)
    }
});

Route.delete('/:id', async function(req, res, next){
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
        if(!result) throw new respon({message: 'not found', code: 200, alert: true});

        // Jika admin ingin menghapus librarian
        if(req.user.role == 'admin' && resultRole[0].name == 'root') throw new respon({ message : 'you dont have permission', code: 200, alert: true})
        if(req.user.role == 'admin' && resultRole[0].name == 'librarian') throw new respon({ message : 'you dont have permission', code: 200, alert: true})
        if(req.user.role == 'admin' && resultRole[0].name == 'admin') throw new respon({ message : 'you dont have permission', code: 200, alert: true})
        if(req.user.role == 'librarian' && resultRole[0].name == 'librarian') throw new respon({ message : 'you dont have permission', code: 200, alert: true})
        if(req.user.role == 'librarian' && resultRole[0].name == 'root') throw new respon({ message : 'you dont have permission', code: 200, alert: true})

        await model.officer.destroy({
            where : {
                id: userId
            }
        });

        res.json(new respon({message: 'successfully deleted', type: true, alert: true, code: 200, show: true, redirect: '/officer'}));
    
    } catch (err) {
        next(err)
    }
});

module.exports = Route