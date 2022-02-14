const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./database/db');
const router = require('./router/router');
const errorMiddleware = require('./middleware/errorMiddleware');
const app = express();


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
    }
};


start();