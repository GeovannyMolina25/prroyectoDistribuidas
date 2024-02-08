const { response } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    host : 'localhost',
    user:'postgres',
    password : '12345678',
    database: 'proyectogasolina',
    port:'5432'
})

//Consultas

const getCombustible = async(req,res) => {
    const response = await pool.query('Select * from combustible');
    res.status(200).json(response.rows);
}

const getCombustibleId = async(req,res) =>{
    try {
        const id = req.params.id;
        const response = await pool.query('SELECT public."ObtenerCombustibleId"($1) AS nombre_conductor', [id]);

        if (response.rows && response.rows.length > 0) {
            res.json(response.rows[0]);
        } else {
            res.status(404).json({ message: 'Conductor no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener conductor por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }

}

module.exports={
    getCombustible,
    getCombustibleId
}
