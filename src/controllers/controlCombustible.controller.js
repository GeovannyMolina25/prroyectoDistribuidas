require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

const getCombustibleControler = async (req, res) => {
  const response = await pool.query("select * from controlCombustible");
  res.status(200).json(response.rows);
};

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
      comentario_controlc,
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
        comentario_controlc,
      ]
    );

    res.json({
      message: "Datos de control de combustible insertados correctamente",
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
          comentario_controlc,
        },
      },
    });
  } catch (error) {
    console.error("Error al insertar datos de control de combustible:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//traer los datos de vehiculo por conductor por conductor
const getCondVehiculo = async (req, res) => {
  try {
    const idConductor = req.params.id;
    const response = await pool.query(
      'SELECT * FROM "ObtenerVehiculoPorConductor"($1)',
      [idConductor]
    );

    if (response.rows && response.rows.length > 0) {
      const vehiculos = response.rows;
      res.json(vehiculos);
    } else {
      res
        .status(404)
        .json({ message: "Vehículos no encontrados para el conductor" });
    }
  } catch (error) {
    console.error("Error al obtener vehículos por conductor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//traer los datos por placa del vehiculo
const getVehiConductor = async (req, res) => {
  try {
    const id = req.params.id;
    const response = await pool.query(
      'select * from "obtenervehiculoporconductor"($1)',
      [id]
    );

    if (response.rows && response.rows.length > 0) {
      res.json(response.rows);
    } else {
      res
        .status(404)
        .json({ message: "Conductores no encontrados para el vehículo" });
    }
  } catch (error) {
    console.error("Error al obtener conductores por vehículo:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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
      res
        .status(404)
        .json({ message: "Vehículos no encontrados para la descripción" });
    }
  } catch (error) {
    console.error("Error al obtener vehículos por descripción:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getVehiDescPorPlaca = async (req, res) => {
  try {
    const placa = req.params.placa;

    const response = await pool.query(
      "SELECT * FROM public.ObtenerVehiculoPorPlaca($1);",
      [placa]
    );

    if (response.rows && response.rows.length > 0) {
      const vehiculo = response.rows[0]; // Solo toma el primer resultado
      res.json(vehiculo); // Envía el resultado en formato JSON
    } else {
      res.status(404).json({
        message: "Vehículo no encontrado para la placa proporcionada",
      });
    }
  } catch (error) {
    console.error("Error al obtener vehículo por placa:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getDatosControlCombustible = async (req, res) => {
  try {
    const response = await pool.query(
      "SELECT placa_vehiculo, descripcion_vehiculo, fecha_control, SUM(galon_controlc) AS total_galon_controlc " +
        'FROM public."ObtenerDatosControlCombustible"() ' +
        "GROUP BY placa_vehiculo, descripcion_vehiculo, fecha_control;"
    );

    if (response.rows && response.rows.length > 0) {
      const datosControlCombustible = response.rows;

      res.json(datosControlCombustible);
    } else {
      res
        .status(404)
        .json({ message: "No se encontraron datos de control de combustible" });
    }
  } catch (error) {
    console.error("Error al obtener datos de control de combustible:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getDatosControlCombustiblePorConductor = async (req, res) => {
  try {
    const idConductor = req.params.id; // Suponiendo que estás pasando el ID del conductor como parámetro

    const response = await pool.query(
      'SELECT * FROM "ObtenerDatosControlCombustiblePorConductor"($1)',
      [idConductor]
    );

    if (response.rows && response.rows.length > 0) {
      const datosControlCombustible = {};

      response.rows.forEach((row) => {
        const placaVehiculo = row.placa_vehiculo;
        const descripcionVehiculo = row.descripcion_vehiculo;
        const fechaControl = row.fecha_control.toISOString().slice(0, 10); // Convertir la fecha a formato ISO

        // Verificar si ya hay datos con la misma placa y fecha
        if (
          datosControlCombustible[placaVehiculo] &&
          datosControlCombustible[placaVehiculo][fechaControl]
        ) {
          // Si existe, sumar los galones de combustible
          datosControlCombustible[placaVehiculo][
            fechaControl
          ].total_galon_controlc += row.galon_controlc;
        } else {
          // Si no existe, agregar el nuevo registro
          if (!datosControlCombustible[placaVehiculo]) {
            datosControlCombustible[placaVehiculo] = {};
          }
          datosControlCombustible[placaVehiculo][fechaControl] = row;
        }
      });

      // Convertir el objeto a un array de objetos
      const result = [];
      for (const placaVehiculo in datosControlCombustible) {
        for (const fechaControl in datosControlCombustible[placaVehiculo]) {
          result.push(datosControlCombustible[placaVehiculo][fechaControl]);
        }
      }

      res.json(result);
    } else {
      res.status(404).json({
        message:
          "No se encontraron datos de control de combustible para el conductor proporcionado",
      });
    }
  } catch (error) {
    console.error("Error al obtener datos de control de combustible:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const getUbiFinalPorUbiOrigen = async (req, res) => {
  try {
    const origen = req.params.origen;

    const response = await pool.query(
      'SELECT * FROM "ObtenerUbicacionPorOrigen"($1);',
      [origen]
    );

    if (response.rows && response.rows.length > 0) {
      const destinos = response.rows.map((row) => row.destino_ubi);
      res.json({ destinos }); // Envía el resultado en formato JSON
    } else {
      res.status(404).json({
        message: "No se encontraron destinos para el origen proporcionado",
      });
    }
  } catch (error) {
    console.error("Error al obtener destinos por origen:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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
      res
        .status(404)
        .json({ message: "No se encontraron datos de kilómetros recorridos" });
    }
  } catch (error) {
    console.error("Error al obtener kilómetros recorridos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
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
      res.status(404).json({
        message:
          "No se encontraron datos de kilometraje para la placa proporcionada",
      });
    }
  } catch (error) {
    console.error("Error al obtener kilometraje por placa:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getConductorPorDescripcion = async (req, res) => {
  try {
    const descripcionVehiculo = req.params.descripcion;

    const response = await pool.query(
      'SELECT * FROM public."ObtenerConductorPorDescripcion"($1)',
      [descripcionVehiculo]
    );

    if (response.rows && response.rows.length > 0) {
      res.json(response.rows);
    } else {
      res.status(404).json({
        message:
          "No se encontraron datos del conductor para la descripción del vehículo proporcionada",
      });
    }
  } catch (error) {
    console.error(
      "Error al obtener conductor por descripción de vehículo:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getConductorContrlCombustiblePorFecha = async (req, res) => {
  try {
    const fecha_cond = req.params.fecha;

    const response = await pool.query(
      'SELECT * from public."ObtenerConductorContrlCombustiblePorFecha"($1)',
      [fecha_cond]
    );

    if (response.rows && response.rows.length > 0) {
      const conductores = response.rows;
      const conductoresUnicos = {};
      conductores.forEach((conductor) => {
        conductoresUnicos[conductor.id_conductor] = conductor;
      });
      const conductoresUnicosArray = Object.values(conductoresUnicos);
      res.json(conductoresUnicosArray);
    } else {
      res.status(404).json({
        message:
          "No se encontraron datos del conductor para la descripción del vehículo proporcionada",
      });
    }
  } catch (error) {
    console.error(
      "Error al obtener conductor por descripción de vehículo:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getDatosDashboartPorFecha = async (req, res) => {
  try {
    const fecha_cond = req.params.fecha;

    const response = await pool.query(
      'SELECT * from public."ObtenerDatosDashboartControlCombustible"($1)',
      [fecha_cond]
    );
    console.log(response.rows);
    if (response.rows && response.rows.length > 0) {
      res.json(response.rows);
    } else {
      res.status(404).json({
        message:
          "No se encontraron datos del conductor para la descripción del vehículo proporcionada",
      });
    }
  } catch (error) {
    console.error(
      "Error al obtener conductor por descripción de vehículo:",
      error
    );
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
const getDatosGraficoPorfecha = async (req, res) => {
    try {
      const fecha_cond = req.params.fecha;
  
      const response = await pool.query(
        'SELECT * from "ObtenerDatosGraficaPorfecha"($1)',
        [fecha_cond]
      );
      console.log(response.rows);
      if (response.rows && response.rows.length > 0) {
        res.json(response.rows);
      } else {
        res.status(404).json({
          message:
            "No se encontraron datos del conductor para la descripción del vehículo proporcionada",
        });
      }
    } catch (error) {
      console.error(
        "Error al obtener conductor por descripción de vehículo:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  
  const getDatosGraficoPorfechaPorId = async (req, res) => {
    try {
        const id = req.params.id;
      const fecha_cond = req.params.fecha;
  
      const response = await pool.query(
        'SELECT * from public."ObtenerDatosGraficaPorfechaPorFechaIdConductor"($1, $2)',
        [fecha_cond, id]
      );
      
      console.log(response.rows);
      if (response.rows && response.rows.length > 0) {
        res.json(response.rows);
      } else {
        res.status(404).json({
          message:
            "No se encontraron datos del conductor para la descripción del vehículo proporcionada",
        });
      }
    } catch (error) {
      console.error(
        "Error al obtener conductor por descripción de vehículo:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  
  const getObtenerPlaca= async (req, res) => {
    try {
      const response = await pool.query(
        'SELECT * from "ObtenerPlacas"()',
      );
      console.log(response.rows);
        if (response.rows && response.rows.length > 0) {
          const vehiculos = response.rows;
          const vehiculoUnicos = {};
          vehiculos.forEach((vehiculo) => {
            vehiculoUnicos[vehiculo.id_vehiculo] = vehiculo;
          });
          const vehiculoUnicosArray = Object.values(vehiculoesUnicos);
          res.json(vehiculoUnicosArray );
      } else {
        res.status(404).json({
          message:
            "No se encontraron datos del conductor para la descripción del vehículo proporcionada",
        });
      }
    } catch (error) {
      console.error(
        "Error al obtener conductor por descripción de vehículo:",
        error
      );
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
  


module.exports = {
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
  getKilometrosRecorridosPorPlaca,
  getConductorPorDescripcion,
  getConductorContrlCombustiblePorFecha,
  getDatosDashboartPorFecha,
  getDatosGraficoPorfecha,
  getDatosGraficoPorfechaPorId,
  getObtenerPlaca
};
