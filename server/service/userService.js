const db = require('../database/db').pool;
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const mailService = require('./mailService');
const tokenService = require('./tokenService');

class UserService{
    async registration(email, password){
        console.log(email, password);
        let user = (await db.query('select * from usr where email = $1',[email])).rows[0];
        if(user){
            throw new Error(`User with email ${email} already exists!`);
        }
        password = bcrypt.hash(password,3);
        const activation_link = uuid.v4();
        user = (await db.query('insert into usr(email, password, activation_link) values($1,$2,$3) returning *',[email,password,activation_link])).rows[0];
        await mailService.sendActivationLink(email,activation_link);

        const tokens = tokenService.generateTokens(user);
        await tokenService.saveToken(tokens.refresh);

        return {...tokens, user};
    }
}

module.exports = new UserService();