import DB from '../database/db';
import uuid from 'uuid';
import bcrypt from 'bcrypt';
import mailService from './mailService';
import tokenService from './tokenService';
import ApiError from '../exception/apiError';
import UserDto from '../dtos/UserDto';

const db:any = DB.pool;

class UserService{
    async registration(email, password){
        let user = (await db.query('select * from usr where email = $1',[email])).rows[0];
        if(user){
            throw ApiError.BadRequest(`User with email ${email} already exists!`);
        }
        password = await bcrypt.hash(password,3);
        const activation_link = uuid.v4();
        user = (await db.query('insert into usr(email, password, activation_link) values($1,$2,$3) returning *',[email,password,activation_link])).rows[0];
        const userDto = new UserDto(user);
        await mailService.sendActivationLink(email,`${process.env.API_URL}/api/activate/${activation_link}`);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken);

        return {...tokens, user: userDto};
    }

    async activate(activation_link){
        const user = (await db.query('select * from usr where activation_link=$1',[activation_link])).rows[0];
        if(!user){
            throw ApiError.BadRequest('Incorrect activation link!');
        }
        await db.query('update usr set isactivated = true where user_id=$1',[user.user_id]);
    }

    async login(email, password){
        const user = (await db.query('select * from usr where email = $1',[email])).rows[0];
        if(!user){
            throw ApiError.BadRequest(`User with email ${email} is not found!`);
        }
        const isPassEquals = await bcrypt.compare(password,user.password);
        if(!isPassEquals){
            throw ApiError.BadRequest(`Incorrect password`);
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async logout(refreshToken){
        const token = tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        // console.log(userData,tokenFromDb);
        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizedError();
        }

        const user = (await db.query('select * from usr where user_id = $1',[userData.id ])).rows[0];
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id,tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async getUsers(){
        const users = (await db.query('select * from usr')).rows;
        return users;
    }
}

export default new UserService();