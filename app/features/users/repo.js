const { User, Token, Role } = require('../../db');

const UserRepo = new (require('../../db/baseRepo'))(User);
const TokenRepo = new (require('../../db/baseRepo'))(Token);
const RoleRepo = new (require('../../db/baseRepo'))(Role);

module.exports = { UserRepo, TokenRepo, RoleRepo };
