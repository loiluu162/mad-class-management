const User = require('../../db');

const getAllUsers = async () => {
    const users = await User.findAll();
    return users;
}

const getUserById = async (id) => {

}

const getUserByEmail = async (id) => {

}