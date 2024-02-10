const { Router } = require('express');
const router = Router();

const { getUsers, createUser, getUserById, deleteUser, updateUser, getUserByName } = require('../controllers/index.controller');
const { getVehiculos } = require('../controllers/vehiculos.controller');
const {getCombustible} = require('../controllers/combustible.controller');
const {getUbicacion} = require('../controllers/ubicacion.controller');
const {getCombustibleControler, insertarDatosControlCombustible,getCondVehiculo,getVehiConductor,getVehiculoPorDescripcion,getVehiDescPorPlaca, 
    getDatosControlCombustible,getDatosControlCombustiblePorConductor,getUbiFinalPorUbiOrigen,getKilometrosRecorridos,
    getKilometrosRecorridosPorPlaca,getConductorPorDescripcion, getConductorContrlCombustiblePorFecha} = require('../controllers/controlCombustible.controller')


//obtener todos los usuarios
router.post('/users', createUser);
//obtener  informacion del conductor por id
router.get('/users/:id', getUserById);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

//Nuevas ruta para obtener ControlCombustible
router.get('/controlCombustible',getCombustibleControler);
//obtener control conbustible todos los datos
router.get('/controlCombustible/:id',getUserByName);

// Nueva ruta para obtener vehículos
//obtener todos los vehiculos
router.get('/vehiculos', getVehiculos);


//Nueva ruta para obtener vehiculos
router.get('/combustibles',getCombustible)

//Nueva ruta para obetner ubicacion de los vehhiculos
router.get('/ubicacion',getUbicacion )

//Nueva ruta para obtener control combustibles
router.get('/ControlRegistro',getCombustibleControler);
//obtener informacion del vehiculo con el id
router.get('/ControlRegistro/CondVehiculo/:id',getCondVehiculo);
//obtener "id_vehiculo""placa_veh":"descripcion_veh por el id del conductor 
router.get('/ControlRegistro/vehiConductor/:id',getVehiConductor);
// obtener vehiculo por la descripcion del vehiculo
router.get('/ControlRegistro/descVehiculo/:descripcion',getVehiculoPorDescripcion);
//Obetener "nombre_conductor,apellido_conductor,descripcion_vehiculo por la placa del vehiculo
router.get('/ControlRegistro/placaDescripcionVehiculo/:placa',getVehiDescPorPlaca);
//Obtener "placa_vehiculo"descripcion_vehiculo","fecha_control","total_galon_controlc"
router.get('/ControlRegistro/DatosControlCombustible',getDatosControlCombustible);
// obtener  "placa_vehiculo""descripcion_vehiculo""fecha_control","galon_controlc" por el id del conductor
router.get('/ControlRegistro/DatosControlCombustiblePorConductor/:id',getDatosControlCombustiblePorConductor);
// obtener destinofinal dependiendo del destino inicial
router.get('/ControlRegistro/UbiFinalPorUbiOrigen/:origen',getUbiFinalPorUbiOrigen);
// Insersion de datos de control registro en la base de datos 
router.post('/ControlRegistro/ControlRegistro',insertarDatosControlCombustible);
// fecha y kilomentros recorridos por cada todos los suma de todos los carros 
router.get('/ControlRegistro/KilometrosRecorridos',getKilometrosRecorridos);
// obtener fecha y kilometros recorridos por la placa 
router.get('/ControlRegistro/KilometrosRecorridosPorPlaca/:placa',getKilometrosRecorridosPorPlaca);
//"nombre_conductor","apellido_conductor","placa_veh" por descripcion del vehiculo
router.get('/ControlRegistro/ConductorPorDescripcion/:descripcion',getConductorPorDescripcion);


router.get('/ControlRegistro/ConductorContrlCombustiblePorFecha/:fecha',getConductorContrlCombustiblePorFecha)
module.exports = router; 