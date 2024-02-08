require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host : process.env.DB_HOST,
    user: process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

const getUbicacion = async(req,res) => {
    const response = await pool.query('Select * from ubicacion');
    res.status(200).json(response.rows);
}

module.exports={
    getUbicacion
}


