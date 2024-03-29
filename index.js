

const express = require('express')
const app = express();
const cors = require("cors");

const cores = require; 

/*

import pg from 'pg'
const pool = new pg.Pool(
    {
        connectionString:process.env.DATABASE_URL,
        ssl:true
    }
)
*/

//middlewares
app.use(cors())
app.use(express.json());
app.use(express.urlencoded(({extended: false})));
//routes
app.use(require('./src/routes/index'));


app.listen(4000);
console.log('Server on port 4000')