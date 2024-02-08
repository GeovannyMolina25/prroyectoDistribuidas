const { response } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    host : 'localhost',
    user:'postgres',
    password : '12345678',
    database: 'proyectogasolina',
    port:'5432'
})

const getUbicacion = async(req,res) => {
    const response = await pool.query('Select * from ubicacion');
    res.status(200).json(response.rows);
}

module.exports={
    getUbicacion
}


