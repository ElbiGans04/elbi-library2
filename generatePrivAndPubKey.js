const crypto = require('crypto');
const fs = require('fs');

const keyPair = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096, // bits - standard for RSA keys
    publicKeyEncoding: {
        type: 'pkcs1', // "Public Key Cryptography Standards 1" 
        format: 'pem' // Most common formatting choice
    },
    privateKeyEncoding: {
        type: 'pkcs1', // "Public Key Cryptography Standards 1"
        format: 'pem' // Most common formatting choice
    }
});

const privateKey = `\nAPP_PRIVATE_KEY="${keyPair.privateKey.replace(/\n/gi, '\\n')}"`
const publicKey = `\nAPP_PUBLIC_KEY="${keyPair.publicKey.replace(/\n/gi, '\\n')}"`;

fs.appendFileSync('./config/.env', privateKey, function(err){
    if(err) throw err;
    console.log("Success")
});
fs.appendFileSync('./config/.env', publicKey, function(err){
    if(err) throw err;
    console.log("Success")
});