const { response } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    host : 'localhost',
    user:'postgres',
    password : '12345678',
    database: 'proyectogasolina',
    port:'5432'
})

//todos los datos
const getCombustibleControler = async(req,res) => {
    const response = await pool.query('select * from controlCombustible');
    res.status(200).json(response.rows);
}

//traer los datos de vehiculo por conductor por conductor
const getCondVehiculo = async (req, res) => {
    try {
        const idConductor = req.params.id;
        const response = await pool.query('SELECT * FROM public."ObtenerVehiculosPorConductor"($1)', [idConductor]);

        if (response.rows && response.rows.length > 0) {
            const vehiculos = response.rows;
            res.json(vehiculos);
        } else {
            res.status(404).json({ message: 'Vehículos no encontrados para el conductor' });
        }
    } catch (error) {
        console.error('Error al obtener vehículos por conductor:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


//traer los datos por placa del vehiculo 
const getVehiConductor = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await pool.query('SELECT * FROM public."ObtenerConductorPorVehiculo"($1)', [id]);

        if (response.rows && response.rows.length > 0) {
            const conductores = response.rows[0]; 
            res.json(conductores);
        } else {
            res.status(404).json({ message: 'Conductores no encontrados para el vehículo' });
        }
    } catch (error) {
        console.error('Error al obtener conductores por vehículo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// obtener vehiculo por descripcion
const getVehiculoPorDescripcion = async (req, res) => {
    try {
        const descripcionVehiculo = req.params.descripcion;

        const response = await pool.query(
            'SELECT * FROM public."ObtenerVehiculoPorDescripcion"($1)',
            [descripcionVehiculo]
        );

        if (response.rows && response.rows.length > 0) {
            const vehiculos = response.rows;
            res.json(vehiculos);
        } else {
            res.status(404).json({ message: 'Vehículos no encontrados para la descripción' });
        }
    } catch (error) {
        console.error('Error al obtener vehículos por descripción:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};







module.exports={
    getCombustibleControler,
    getCondVehiculo,
    getVehiConductor,
    getVehiculoPorDescripcion
}
