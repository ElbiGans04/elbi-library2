const crypto = require('crypto');
const fs = require('fs');

// const keyPair = crypto.generateKeyPairSync('rsa', {
//     modulusLength: 4096, // bits - standard for RSA keys
//     publicKeyEncoding: {
//         type: 'pkcs1', // "Public Key Cryptography Standards 1" 
//         format: 'pem' // Most common formatting choice
//     },
//     privateKeyEncoding: {
//         type: 'pkcs1', // "Public Key Cryptography Standards 1"
//         format: 'pem' // Most common formatting choice
//     }
// });

// fs.appendFileSync('./config/.env', keyPair.publicKey.replace(/\n/gi, '\\n'), function(err){
//     if(err) throw err;
//     console.log("Success")
// });
// fs.appendFileSync('./config/.env', keyPair.privateKey.replace(/\n/gi, '\\n'), function(err){
//     if(err) throw err;
//     console.log("Success")
// });