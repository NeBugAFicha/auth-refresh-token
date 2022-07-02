import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from './database/db';
import router from './router/router';
import errorMiddleware from './middleware/errorMiddleware';
const app: any = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials:true,
    origin: process.env.CLIENT_URL
}));
app.use('/api',router);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

const start = async ()=>{
    try{
        await db.connect().then(()=>console.log(`Connected to database ${process.env.DB_NAME}`));
        app.listen(PORT, () => console.log(`Server started listening on PORT ${PORT}`));
    }catch(e){
        console.log(e);
        console.log('errorr');
    }
};

start();

// const {Pool,Client} = require('pg');
// const pgpool = new Pool({
//     host: 'localhost',
//     user: 'postgres',
//     database: 'egor_project',
//     password: '1234',
//     port: 5432
//     max: 1,
//     idleTimeoutMillis: 10,
//     allowExitOnIdle: true
//     connectionTimeoutMillis: 0,
//     rejectUnauthorized: false,
//     ssl: true
// })
// this.pool.query = async (text,params,callback)=>{
//     return await this.pool.connection.query(text,params,callback);
// } 
// app.get("/all", async(req,res)=>{
//      const pgpool = new Client({
//         host: 'localhost',
//         user: 'postgres',
//         database: 'egor_project',
//         password: '1234',
//         port: 5432
//         // max: 5,
//         // idleTimeoutMillis: 10,
//         // connectionTimeoutMillis: 0,
//         // rejectUnauthorized: false,
//         // ssl: true
//     })
    
//     pool.query(`insert into testtable(id,text) values (1,'bb'),(2,'bb')`);
//     const results = await pool.query('select * from testtable');
//     console.log(results);
//     await pool.release();
//     res.send({"rows": results.rows});
// })
// app.listen(3000, () => 
//     console.log(`Server started listening on PORT 3000`));

