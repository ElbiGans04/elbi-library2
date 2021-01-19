let obj = {};
let model = require('../models/model-index');
let jwt = require('jsonwebtoken');

obj.get = async function(req, res) {
    try {

        // Verify TOken
        let token = req.cookies.token;
        if(!token) throw {code: 404, message: new Error('token not found')}

        let tokenVerify = jwt.verify(token, process.env.APP_PUBLIC_KEY, {
            algorithms: 'RS256'
        });

        if(!tokenVerify.isAdmin) throw {code: 401, message: new Error('only for admin')}

        let { member } = await model();
        const id = req.params.id;
    
        let result = await member.findAll({
            where: {
                id
            }
        });
    
        if(result.length <= 0) throw {code: 404, message: new Error('member not found')};

        // Jika Ada maka Kirimkan
        res.json(result);
        
    } catch ( err ) {
        const code = err.code || 500;
        const message = err.message.message || err.message
        res.status(code).send(message)
    }
}


obj.getAll = async function (req, res) {
    try {
        let { member } = await model();
    
        // Verify
        let token = req.cookies.token;
        if(!token) throw {code: 404, message: new Error('token not found')}
    
        let tokenVerify = jwt.verify(token, process.env.APP_PUBLIC_KEY, {
            algorithms: 'RS256'
        });
    
        if(!tokenVerify.isAdmin) throw {code: 401, message: new Error('only for admin')}
        
        let allMember = await member.findAll();
        res.json(allMember)

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
        let token = req.cookies.token;
        if(!token) throw {code: 404, message: new Error('token not found')}
         
        let tokenVerify = jwt.verify(token, process.env.APP_PUBLIC_KEY, {
            algorithms: 'RS256'
        });

        if(!tokenVerify.isAdmin) throw {code: 401, message: new Error('only for admin')}

        // Vadidation 
        let validation = await member.findAll({
            where : {
                email : req.body.email
            },
            raw: true
        });

        // Jika Tidak Ada
        if (validation.length > 0) throw {code: 409, message: new Error('email already register')};
        let result = await member.create(req.body);
        
        res.sendStatus(200)
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
        let token = req.cookies.token;
        if(!token) throw {code: 404, message: new Error('token not found')}
         
        let tokenVerify = jwt.verify(token, process.env.APP_PUBLIC_KEY, {
            algorithms: 'RS256'
        });
        
        if(!tokenVerify.isAdmin) throw {code: 401, message: new Error('only for admin')}

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
        let token = req.cookies.token;
        if(!token) throw {code: 404, message: new Error('token not found')}
         
        let tokenVerify = jwt.verify(token, process.env.APP_PUBLIC_KEY, {
            algorithms: 'RS256'
        });

        if(!tokenVerify.isAdmin) throw {code: 401, message: new Error('only for admin')}
        
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

module.exports = obj;