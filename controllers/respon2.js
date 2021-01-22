module.exports = function (data) {
    this.code = data.code || 500;
    this.message = data.message.message || data.message;
    this.redirect = data.redirect || false;
    this.type = data.type || false;
}