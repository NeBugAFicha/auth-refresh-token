const jwt = require('jsonwebtoken');
const db = require('../database/db').pool;

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn:'10m'});
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:'10d'});
        return {
            accessToken,refreshToken
        }
    }

    async saveToken(user_id, refreshToken){
        await db.query('insert into usr_token values($1,$2) on conflict(user_id) do update set refresh_token = $2',[user_id,refreshToken]);
    }
}

module.exports = new TokenService();