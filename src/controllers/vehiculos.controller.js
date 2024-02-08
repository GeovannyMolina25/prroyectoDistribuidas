const { response } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    host : 'localhost',
    user:'postgres',
    password : '12345678',
    database: 'proyectogasolina',
    port:'5432'
})

const getVehiculos = async(req,res) => {
    const response = await pool.query('Select * from vehiculo');
    res.status(200).json(response.rows);
}

module.exports={
    getVehiculos
}
