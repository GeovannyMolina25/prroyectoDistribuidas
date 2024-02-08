const { Router } = require('express');
const router = Router();

const { getUsers, createUser, getUserById, deleteUser, updateUser, getUserByName } = require('../controllers/index.controller');
const { getVehiculos } = require('../controllers/vehiculos.controller');
const {getCombustible} = require('../controllers/combustible.controller');
const {getUbicacion} = require('../controllers/ubicacion.controller');
const {getCombustibleControler,getCondVehiculo,getVehiConductor,getVehiculoPorDescripcion,getVehiDescPorPlaca} = require('../controllers/controlCombustible.controller')



router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

//Nuevas ruta para obtener ControlCombustible
router.get('/controlCombustible',getCombustibleControler);
router.get('/controlCombustible/:id',getUserByName);

// Nueva ruta para obtener vehículos
router.get('/vehiculos', getVehiculos);


//Nueva ruta para obtener vehiculos
router.get('/combustibles',getCombustible)

//Nueva ruta para obetner ubicacion de los vehhiculos
router.get('/ubicacion',getUbicacion )

//Nueva ruta para obtener control combustibles
router.get('/ControlRegistro',getCombustibleControler);
router.get('/ControlRegistro/CondVehiculo/:id',getCondVehiculo);
router.get('/ControlRegistro/vehiConductor/:id',getVehiConductor);
router.get('/ControlRegistro/descVehiculo/:descripcion',getVehiculoPorDescripcion);
router.get('/ControlRegistro/placaDescripcionVehiculo/:placa',getVehiDescPorPlaca)


module.exports = router; 