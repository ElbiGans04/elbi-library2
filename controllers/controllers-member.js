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
            const code = err.code || 500;
            const message = err.message.message || err.message
            res.status(code).send(message)
        }
    },



    // Post
    post: async function(req, res){
        try {
            let { member } = await model();
            let {role: userRole} = req.user;
            
            // Vadidation 
            let validation = await member.findAll({
                where : {
                    email : req.body.email
                },
                raw: true
            });
            
            // Jika Ada
            if (validation.length > 0) throw new respon2({code: 200, message: 'user already'});
            if(req.body.role.toLowerCase() == 'librarian') throw new respon2({code: 200, message: 'You do not have permission to add a user with that role'})
            if(userRole == 'user' && req.body.role.toLowerCase() == 'admin') throw new respon2({code: 200, message: 'You do not have permission to add a user with that role'})
            
            let result = await member.create(req.body, {});
            
            res.json(new respon2({message: 'successfully added members'}))
    
        } catch (err) {
            console.log(err);
            if(err instanceof Error) {
                if(err.errors) err.message = moduleLibrary.pesanError(err)
                else if(err.message == `Cannot read property 'originalname' of undefined`) err.message = 'please insert image'
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
    
            // Verify
            // Validation
            let validation = await member.findAll({
                where: {
                    id: entitasId
                },
                raw: true
            });
    
            // Jika member tidak ditemukan
            if(validation.length <= 0) throw new respon2({message: 'member not found', code: 200})
    
            // Jika Ditemukan maka lanjutkan
            await member.update(req.body, {
                where: {
                    id: entitasId
                }
            })
    
    
            res.json(new respon2({message: 'success', type: true}))
    
        } catch (err) {
            const code = err.code || 500;
            const message = err.message.message || err.message
            res.status(code).send(message)
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
            console.log(err)
            const code = err.code || 500;
            res.status(code).send(err)
        }
    }
};