module.exports = function (data) {
    let type = data.type || false;
    let message = data.message || '';
    let redirect = data.redirect || false;
    
    
    return {
        type,
        message,
        redirect
    }
}