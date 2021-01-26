let obj = {};
let model = require('../models/model-index');
let jwt = require('jsonwebtoken');
const {auth} = require('./module');
const respon2 = require('./respon2')

obj.get = async function(req, res) {
    try {
        let { member } = await model();
        const id = req.params.id;
        
        // Auth
        if(await auth(req, 'admin') == true) {
            let result = await member.findOne({
                where: {
                    id
                }
            });
        
            if(result.length <= 0) throw new respon2({message: 'member not found', code: 200});
    
            // Jika Ada maka Kirimkan
            res.json(new respon2({message: 'success', code: 200, data: result}));
        }

        
    } catch ( err ) {
        const code = err.code || 500;
        const message = err.message.message || err.message
        res.status(code).send(message)
    }
}


obj.getAll = async function (req, res) {
    try {
        let { member } = await model();
    
        if(await auth(req, 'admin') == true) {
            let allMember = await member.findAll();
            let coloumn = Object.keys(await member.rawAttributes);
            res.render('table', {
                data: allMember,
                coloumn,
                without:['id', 'createdat', 'updatedat', 'isadmin'],
                title: 'Member',
                active: 'member',
                module: require('./module'),
                buttonAdd: 'fas fa-user mr-2'
            })
            // res.json(allMember)
        }

    } catch (err) {
        const code = err.code || 500;
        const message = err.message.message || err.message
        res.status(code).send(message)
    }
};

obj.post = async function(req, res){
    try {
        let { member } = await model();

        // Verification
        if(await auth(req, 'admin') == true) {
            // Vadidation 
            let validation = await member.findAll({
                where : {
                    email : req.body.email
                },
                raw: true
            });
    
            // Jika Tidak Ada
            if (validation.length > 0) throw new respon2({code: 200, message: new Error('user already')});
            let result = await member.create(req.body, {
                attribute: {
                    excludes: ['isAdmin']
                }
            });
            
            res.json(new respon2({message: 'successfully added members'}))
        }

    } catch (err) {
        console.log(err.message)
        const code = err.code || 500;
        res.status(code).json(err)
    }
};

obj.put = async function (req, res) {
    try {
        console.log(req.body)
        let { member } = await model();
        let entitasId = req.params.id;

        // Verify
        if(await auth(req, 'admin') == true) {
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
        }

    } catch (err) {
        const code = err.code || 500;
        const message = err.message.message || err.message
        res.status(code).send(message)
    }
};

obj.delete = async function (req, res) {
    try {
        let { member } = await model();
        let id = req.params.id;
        
        // Verify
        if(await auth(req, 'admin') == true) {
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
        }
        
    } catch (err) {
        console.log(err)
        const code = err.code || 500;
        res.status(code).send(err)
    }
};


// Register
obj.register = async function(req, res){
    try {
        let { member } = await model();

        // Vadidation 
        let validation = await member.findAll({
            where : {
                email : req.body.email
            },
            raw: true
        });

        // Jika Tidak Ada
        if (validation.length > 0) throw new respon2({message: 'email already register', code: 200})
        let result = await member.create(req.body, {
            attribute: {
                excludes: ['isAdmin']
            }
        });
        const resultId = result.dataValues.id;
        const isAdmin = result.dataValues.isAdmin;

        const token = jwt.sign({id: resultId, isAdmin}, process.env.APP_PRIVATE_KEY, {
            expiresIn: '1d',
            algorithm: 'RS256'
        });

        res.cookie('token', token, {
            maxAge: process.env.APP_MAX_AGE * 1000
        });

        res.json(new respon2({message: 'Register successfully', redirect:'/', type: true}))
    } catch (err) {
        console.log(err)
        const code = err.code || 500;
        res.status(code).json(err);
    }
};

obj.login = async function (req, res) {
    try {
        console.log(req.body)
        const { member } = await model();
        const { email } = req.body;
        const password2 = req.body.password
    
        let result = await member.findAll({
            where: {
                email
            },
            raw: true
        });
        
        if(result.length <= 0) throw new respon2({message: 'accouunt not found', code: 200})
        
        let {id, isAdmin, password} = result[0];
        isAdmin = isAdmin === 1 ? true : false;

        if(password !== password2) throw new respon2({message: 'password wrong', code: 200})

        
        const token = jwt.sign({isAdmin, id}, process.env.APP_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: '1d'
        });

        res.cookie('token', token, {
            maxAge: process.env.APP_MAX_AGE * 1000
        })
        res.json(new respon2({message: `success. the page will redirect in <strong> 3 seconds</strong>`, type: true, redirect: '/members'}))
        
    } catch (err) {
        console.log(err.message);
        const code = err.code || 500;
        return res.status(code).json(err)
    }
    
};

obj.logout = function(req, res){
    res.cookie('token', {}, {
        maxAge: -1000000
    });

    console.log("Cookie Telah Dihapus");
    res.redirect('/login')
}

module.exports = obj;