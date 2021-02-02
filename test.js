const pug = require('pug');
console.log(pug.renderFile('./views/navBar.pug', {
    self: true,
    globals: ['fael']
}))