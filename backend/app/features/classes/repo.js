const { Class, StudyTime } = require('../../db');

const ClassRepo = new (require('../../db/baseRepo'))(Class);
const StudyTimeRepo = new (require('../../db/baseRepo'))(StudyTime);

module.exports = { ClassRepo, StudyTimeRepo };
