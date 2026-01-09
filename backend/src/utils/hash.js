const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

async function checkPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);   
}
module.exports = { hashPassword, checkPassword };
