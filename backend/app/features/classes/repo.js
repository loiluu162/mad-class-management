const { Class } = require('../../db');

const ClassRepo = new (require('../../db/baseRepo'))(Class);

module.exports = { ClassRepo };
