let obj = {};
let model = require('../models/model-index');
let jwt = require('jsonwebtoken');
const respon = require('../controllers/respon')

async function auth(req, who) {
    // Verify TOken
    let token = req.cookies.token;
    if(!token) throw {code: 404, message: new Error('token not found')}

    let tokenVerify = jwt.verify(token, process.env.APP_PUBLIC_KEY, {
        algorithms: 'RS256'
    });

    const {id} = tokenVerify;
    let {member} = await model();
    
    let checkUser = await member.findAll({where: id});
    if(checkUser.length <= 0) throw {code: 403,message: new Error('unregistered user')}

    if(who == 'admin') if(!tokenVerify.isAdmin) throw {code: 403, message: new Error('only for admin')};

    return true
}

obj.get = async function(req, res) {
    try {
        let { member } = await model();
        const id = req.params.id;
        
        // Auth
        if(await auth(req, 'admin') == true) {
            let result = await member.findAll({
                where: {
                    id
                }
            });
        
            if(result.length <= 0) throw {code: 404, message: new Error('member not found')};
    
            // Jika Ada maka Kirimkan
            res.json(result);
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
            res.render('index', {
                data: allMember,
                coloumn,
                without: ['id', 'createdat', 'updatedat', 'isadmin']
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
            if (validation.length > 0) throw {code: 409, message: new Error('email already register')};
            let result = await member.create(req.body, {
                attribute: {
                    excludes: ['isAdmin']
                }
            });
            
            res.sendStatus(200)
        }

    } catch (err) {
        const code = err.code || 500;
        const message = err.message.message || err.message
        res.status(code).send(message)
    }
};

obj.put = async function (req, res) {
    try {
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
            if(validation.length <= 0) throw new Error('member not found')
            
            // Jika Ditemukan maka lanjutkan
            await member.update(req.body, {
                where: {
                    id: entitasId
                }
            })
    
    
            res.sendStatus(200)
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
            if ( validation.length <= 0 ) throw new Error('member not found');
    
            // Hapus member
            await member.destroy({
                where: {
                    id
                }
            })
            res.send('okay')
        }
        
    } catch (err) {
        const code = err.code || 500;
        const message = err.message.message || err.message
        res.status(code).send(message)
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
        if (validation.length > 0) throw new Error('email already register');
        let result = await member.create(req.body);
        const resultId = result.dataValues.id;
        const isAdmin = result.dataValues.isAdmin;

        const token = jwt.sign({id: resultId, isAdmin}, process.env.APP_PRIVATE_KEY, {
            expiresIn: '1d',
            algorithm: 'RS256'
        });

        res.cookie('token', token, {
            maxAge: process.env.APP_MAX_AGE * 1000
        });

        res.sendStatus(200);
    } catch (err) {
        const code = err.code || 500;
        const message = err.message.message || err.message
        res.status(code).send(message)
    }
};

obj.login = async function (req, res) {
    try {
        const { member } = await model();
        const { email } = req.body;
        const password2 = req.body.password
    
        let result = await member.findAll({
            where: {
                email
            },
            raw: true
        });
        
        if(result.length <= 0) return res.json(respon({message: 'member not found', type: false}));
        
        let {id, isAdmin, password} = result[0];
        isAdmin = isAdmin === 1 ? true : false;
        
        if(password !== password2) return res.json(respon({message: 'wrong password'}))

        
        const token = jwt.sign({isAdmin, id}, process.env.APP_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: '1d'
        });

        res.cookie('token', token, {
            maxAge: process.env.APP_MAX_AGE * 1000
        })
        res.status(200).json(respon({message: `success. the page will redirect in <strong> 3 seconds</strong>`, type: true, redirect: '/member'}))
        
    } catch (err) {
        console.log(err);
        const code = err.code || 500;
        return res.sendStatus(code)
    }
    
};

obj.logout = function(req, res){
    res.cookie('token', {}, {
        maxAge: -1000000
    });

    console.log("Cookie Telah Dihapus");
    res.sendStatus(200)
}

module.exports = obj;