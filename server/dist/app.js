"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = __importDefault(require("./database/db"));
const router_1 = __importDefault(require("./router/router"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', router_1.default);
app.use(errorMiddleware_1.default);
const PORT = process.env.PORT || 5000;
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.default.connect().then(() => console.log(`Connected to database ${process.env.DB_NAME}`));
        app.listen(PORT, () => console.log(`Server started listening on PORT ${PORT}`));
    }
    catch (e) {
        console.log(e);
        console.log('errorr');
    }
});
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
