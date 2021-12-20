const { Registration } = require('../../db');

const RegistrationRepo = new (require('../../db/baseRepo'))(Registration);

module.exports = { RegistrationRepo };
