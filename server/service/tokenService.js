const jwt = require('jsonwebtoken');
const db = require('../database/db').pool;

class TokenService{
    generateTokens(payload){
        const accessToken = jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn:'15s'});
        const refreshToken = jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:'30s'});
        return {
            accessToken,refreshToken
        }
    }

    async saveToken(id, refreshToken){
        await db.query('insert into usr_token values($1,$2) on conflict(user_id) do update set refresh_token = $2',[id,refreshToken]);
    }
    
    async removeToken(refreshToken){
        const tokenData = (await db.query('delete from usr_token where refresh_token = $1 returning *',[refreshToken])).rows[0];
        return tokenData;
    }

    validateAccessToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        }catch(e){
            return null;
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        }catch(e){
            return null;
        }
    }

    async findToken(refreshToken){
        const tokenData = (await db.query('select * from usr_token where refresh_token = $1',[refreshToken])).rows[0];
        return tokenData;
    }
}
module.exports = new TokenService();