const { response } = require('express');
const { Pool } = require('pg');

const pool = new Pool({
    host : 'localhost',
    user:'postgres',
    password : '12345678',
    database: 'proyectogasolina',
    port:'5432'
})

const getCombustibleControler = async(req,res) => {
    const response = await pool.query('select * from controlCombustible');
    res.status(200).json(response.rows);
}

const insertarDatosControlCombustible = async (req, res) => {
    try {
        const {
            fecha_control,
            id_vehiculo,
            descripcion_veh,
            id_ubicacion,
            km_inicial_controlc,
            km_final_controlc,
            km_recorrido_controlc,
            galon_controlc,
            valorcompra_controlc,
            km_galon_controlc,
            km_moneda_controlc,
            id_combustible,
            no_documento_controlc,
            comentario_controlc
        } = req.body;

        const response = await pool.query(
            'SELECT * FROM public."InsertarDatosControlCombustible"($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)',
            [
                fecha_control,
                id_vehiculo,
                descripcion_veh,
                id_ubicacion,
                km_inicial_controlc,
                km_final_controlc,
                km_recorrido_controlc,
                galon_controlc,
                valorcompra_controlc,
                km_galon_controlc,
                km_moneda_controlc,
                id_combustible,
                no_documento_controlc,
                comentario_controlc
            ]
        );

        res.json({
            message: 'Datos de control de combustible insertados correctamente',
            body: {
                datos_insertados: {
                    fecha_control,
                    id_vehiculo,
                    descripcion_veh,
                    id_ubicacion,
                    km_inicial_controlc,
                    km_final_controlc,
                    km_recorrido_controlc,
                    galon_controlc,
                    valorcompra_controlc,
                    km_galon_controlc,
                    km_moneda_controlc,
                    id_combustible,
                    no_documento_controlc,
                    comentario_controlc
                }
            }
        });
    } catch (error) {
        console.error('Error al insertar datos de control de combustible:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


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

const getVehiDescPorPlaca = async (req, res) => {
    try {
        const placa = req.params.placa;

        const response = await pool.query(
            'SELECT * FROM public.ObtenerInfoConductorVehiculo($1);',
            [placa]
        );

        if (response.rows && response.rows.length > 0) {
            const vehiculo = response.rows[0]; // Solo toma el primer resultado
            res.json(vehiculo); // Envía el resultado en formato JSON
        } else {
            res.status(404).json({ message: 'Vehículo no encontrado para la placa proporcionada' });
        }
    } catch (error) {
        console.error('Error al obtener vehículo por placa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getDatosControlCombustible = async (req, res) => {
    try {
        const response = await pool.query(
            'SELECT placa_vehiculo, descripcion_vehiculo, fecha_control, SUM(galon_controlc) AS total_galon_controlc FROM public."ObtenerDatosControlCombustiblePorConductor"() GROUP BY placa_vehiculo, descripcion_vehiculo, fecha_control;'
        );

        if (response.rows && response.rows.length > 0) {
            const datosControlCombustible = {};

            response.rows.forEach(row => {
                const placa = row.placa_vehiculo;
                const fecha = row.fecha_control.toISOString().slice(0, 10); // Convertir la fecha a formato ISO

                // Verificar si ya hay datos con la misma placa y fecha
                if (datosControlCombustible[placa] && datosControlCombustible[placa][fecha]) {
                    // Si existe, sumar los galones de combustible
                    datosControlCombustible[placa][fecha].total_galon_controlc += row.total_galon_controlc;
                } else {
                    // Si no existe, agregar el nuevo registro
                    if (!datosControlCombustible[placa]) {
                        datosControlCombustible[placa] = {};
                    }
                    datosControlCombustible[placa][fecha] = row;
                }
            });

            // Convertir el objeto a un array de objetos
            const result = [];
            for (const placa in datosControlCombustible) {
                for (const fecha in datosControlCombustible[placa]) {
                    result.push(datosControlCombustible[placa][fecha]);
                }
            }

            res.json(result);
        } else {
            res.status(404).json({ message: 'No se encontraron datos de control de combustible' });
        }
    } catch (error) {
        console.error('Error al obtener datos de control de combustible:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
const getDatosControlCombustiblePorConductor = async (req, res) => {
    try {
        // Obtener el Id_conductor del cuerpo de la solicitud o de donde corresponda
        const idConductor = req.body.id; // Suponiendo que se proporciona en el cuerpo de la solicitud

        const response = await pool.query(
            'SELECT placa_vehiculo, descripcion_vehiculo, fecha_control, SUM(galon_controlc) AS total_galon_controlc FROM public."ObtenerDatosControlCombustiblePorConductor"($1) GROUP BY placa_vehiculo, descripcion_vehiculo, fecha_control;',
            [idConductor]
        );

        if (response.rows && response.rows.length > 0) {
            const datosControlCombustible = {};

            response.rows.forEach(row => {
                const placa = row.placa_vehiculo;
                const fecha = row.fecha_control.toISOString().slice(0, 10); // Convertir la fecha a formato ISO

                // Verificar si ya hay datos con la misma placa y fecha
                if (datosControlCombustible[placa] && datosControlCombustible[placa][fecha]) {
                    // Si existe, sumar los galones de combustible
                    datosControlCombustible[placa][fecha].total_galon_controlc += row.total_galon_controlc;
                } else {
                    // Si no existe, agregar el nuevo registro
                    if (!datosControlCombustible[placa]) {
                        datosControlCombustible[placa] = {};
                    }
                    datosControlCombustible[placa][fecha] = row;
                }
            });

            // Convertir el objeto a un array de objetos
            const result = [];
            for (const placa in datosControlCombustible) {
                for (const fecha in datosControlCombustible[placa]) {
                    result.push(datosControlCombustible[placa][fecha]);
                }
            }

            res.json(result);
        } else {
            res.status(404).json({ message: 'No se encontraron datos de control de combustible para el conductor proporcionado' });
        }
    } catch (error) {
        console.error('Error al obtener datos de control de combustible:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getUbiFinalPorUbiOrigen  = async (req, res) => {
    try {
        const origen = req.params.origen;

        const response = await pool.query(
            'SELECT * FROM public."ObtenerUbicacionPorOrigen"($1);',
            [origen]
        );

        if (response.rows && response.rows.length > 0) {
            const destinos = response.rows.map(row => row.destino_ubi);
            res.json({ destinos }); // Envía el resultado en formato JSON
        } else {
            res.status(404).json({ message: 'No se encontraron destinos para el origen proporcionado' });
        }
    } catch (error) {
        console.error('Error al obtener destinos por origen:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
const getKilometrosRecorridos = async (req, res) => {
    try {
        const response = await pool.query(
            'SELECT * FROM public."ObtenerKilometrosRecorridos"();'
        );

        if (response.rows && response.rows.length > 0) {
            const kilometrosRecorridos = response.rows;
            res.json(kilometrosRecorridos);
        } else {
            res.status(404).json({ message: 'No se encontraron datos de kilómetros recorridos' });
        }
    } catch (error) {
        console.error('Error al obtener kilómetros recorridos:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

const getKilometrosRecorridosPorPlaca = async (req, res) => {
    try {
        const placa = req.params.placa;

        const response = await pool.query(
            'SELECT * FROM public."ObtenerKilometrosRecorridosPorPlaca"($1);',
            [placa]
        );

        if (response.rows && response.rows.length > 0) {
            const kilometrosRecorridos = response.rows;
            res.json(kilometrosRecorridos);
        } else {
            res.status(404).json({ message: 'No se encontraron datos de kilometraje para la placa proporcionada' });
        }
    } catch (error) {
        console.error('Error al obtener kilometraje por placa:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


module.exports={
    getCombustibleControler,
    insertarDatosControlCombustible,
    getCondVehiculo,
    getVehiConductor,
    getVehiculoPorDescripcion,
    getVehiDescPorPlaca,
    getDatosControlCombustible,
    getDatosControlCombustiblePorConductor,
    getUbiFinalPorUbiOrigen,
    getKilometrosRecorridos,
    getKilometrosRecorridosPorPlaca
}
