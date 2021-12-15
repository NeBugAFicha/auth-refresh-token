const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const {Pool} = require('pg');
const router = require('./router/router');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api',router);

const PORT = process.env.PORT || 5000;
const { DB_HOST, DB_PASSWORD, DB_NAME, DB_USER } = process.env;

const start = async ()=>{
    try{
        let pgpool = new Pool({
            host: DB_HOST,
            user: DB_USER,
            database: DB_NAME,
            password: DB_PASSWORD,
            max: 10000,
            min: 10,
            idleTimeoutMillis: 5000,
            connectionTimeoutMillis: 5000,
            //rejectUnauthorized: false,
            //ssl: true
        });
        await pgpool.connect(()=>console.log(`Connected to database ${DB_NAME}`));
        app.listen(PORT, () => console.log(`Server started listening on PORT ${PORT}`));
    }catch(e){
        console.lot(e);
    }
};


start();