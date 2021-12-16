const {Pool} = require('pg');
require('dotenv').config();

const { DB_HOST, DB_PASSWORD, DB_NAME, DB_USER } = process.env;

module.exports = {
    pool:{}, 
    connect: async function(){
        const pgpool = new Pool({
            host: DB_HOST,
            user: DB_USER,
            database: DB_NAME,
            password: DB_PASSWORD,
            port: 5432,
            max: 10000,
            min: 10,
            idleTimeoutMillis: 5000,
            connectionTimeoutMillis: 5000,
            //rejectUnauthorized: false,
            //ssl: true
        })
        this.pool.connection = await pgpool.connect();
        this.pool.query = async (text,params,callback)=>{
            return await this.pool.connection.query(text,params,callback);
        } 
    }
};