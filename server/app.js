console.log(1);
const { JsonWebTokenError } = require('jsonwebtoken');
const xlsx = require('xlsx');
const path = require('path')
let workbook_salePriceUpdateFile = xlsx.readFile('C:\\Users\\Aleksanov.Egor\\VSCode-projects\\auth-refreshtoken\\server\\КАМы бренды 2.xlsx');
let worksheet_salePriceUpdateFile = workbook_salePriceUpdateFile.Sheets[workbook_salePriceUpdateFile.SheetNames[0]];
let salePriceUpdateArr = xlsx.utils.sheet_to_json(worksheet_salePriceUpdateFile, {blankRows: false});
salePriceUpdateArr.forEach(el=>console.log(el));
//заменяем входные названия столбцов на те что используются в бд
console.log()

/*const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./database/db');
require('dotenv').config();
const router = require('./router/router');
const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use('/api',router);

const PORT = process.env.PORT || 5000;

const start = async ()=>{
    try{
        await db.connect().then(()=>console.log(`Connected to database ${process.env.DB_NAME}`));
        app.listen(PORT, () => console.log(`Server started listening on PORT ${PORT}`));
    }catch(e){
        console.log(e);
    }
};


start();*/