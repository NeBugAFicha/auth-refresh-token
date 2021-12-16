const jwt = require('jsonwebtoken');
const db = require('../database/db');

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn:'10m'});
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:'10d'});
        return {
            accessToken,refreshToken
        }
    }

    async saveToken(email, token){
        await db.query('insert into usr_token values(%1,%2) on conflict do update refresh_token = %2',[email,token]);
    }
}

module.exports = new TokenService();