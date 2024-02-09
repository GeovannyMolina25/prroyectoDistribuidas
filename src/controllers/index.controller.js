require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host : process.env.DB_HOST,
    user: process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});
const getUsers = async(req, res)=>{
    const response = await pool.query('Select * from conductor');
    res.status(200).json(response.rows);
    
}
const getUserById = async (req, res) => {
    try {
        const idConductor = req.params.id; // Suponiendo que recibes el id del conductor como un parámetro en la URL

        const response = await pool.query(
            'SELECT * FROM Conductor WHERE id_conductor = $1',
            [idConductor]
        );

        if (response.rows && response.rows.length > 0) {
            const conductor = response.rows[0]; // Obtener el primer conductor encontrado
            res.json({ conductor: conductor });
        } else {
            res.status(404).json({ message: 'No se encontraron datos del conductor' });
        }
    } catch (error) {
        console.error('Error al obtener conductor por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


const getUserByName = async (req, res) => {
    try {
        const nombre = req.params.id;
        const response = await pool.query('SELECT * FROM conductor WHERE nombre_con = $1', [nombre]);

        if (response.rows && response.rows.length > 0) {
            res.json(response.rows);
        } else {
            res.status(404).json({ message: 'No se encontraron conductores con el nombre proporcionado' });
        }
    } catch (error) {
        console.error('Error al obtener conductores por nombre:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};


const getUserByIdCombustible = async(req, res) =>{
    const id = req.params.id;
    const response = await pool.query('Select * from ControlCombustible  WHERE id_controlcombustible = $1', [id]);
    res.json(response.rows);

}
const createUser = async (req, res) => {
    
    const { nombre_con, apellido_con, cedula_con, numero_Telefono_con, correo_con, fecha_de_nacimiento_con } = req.body;

    const response = await pool.query(
        'INSERT INTO Conductor (nombre_con, apellido_con, cedula_con, numero_Telefono_con, correo_con, fecha_de_nacimiento_con) VALUES ($1, $2, $3, $4, $5, $6)',
        [nombre_con, apellido_con, cedula_con, numero_Telefono_con, correo_con, fecha_de_nacimiento_con]
    );

    res.json(
        {
            message:'User added succesfully',
            body:{
                user: 
                {nombre_con, apellido_con, cedula_con, numero_Telefono_con, correo_con, fecha_de_nacimiento_con}

            }
        }
    )
};


const updateUser = async (req, res) => {
    const id = req.params.id;
    const { nombre_con, apellido_con, cedula_con, numero_Telefono_con, correo_con, fecha_de_nacimiento_con } = req.body;
    const response = await pool.query('UPDATE Conductor SET nombre_con = $1, apellido_con = $2, cedula_con = $3, numero_Telefono_con = $4, correo_con = $5, fecha_de_nacimiento_con = $6 WHERE id_conductor = $7', [
        nombre_con,
        apellido_con,
        cedula_con,
        numero_Telefono_con,
        correo_con,
        fecha_de_nacimiento_con,
        id
    ]);
    console.log(response);
    res.json('User update successful');
}


const deleteUser = async(req,res) =>{
    const id = req.params.id;
    const response = await pool.query('DELETE FROM Conductor WHERE id_conductor = $1',[id]);
    console.log(response);
    res.json(`User ${id} delete successfully`)

}




module.exports = {
    getUsers,
    getUserById,
    getUserByName,
    createUser,
    updateUser,
    deleteUser,
    getUserByIdCombustible
    
};

