-- Crear la base de datos
CREATE DATABASE proyectogasolina;

-- Conectar a la base de datos
\c proyectogasolina;

-- Crear la tabla "combustible"
CREATE TABLE IF NOT EXISTS public.combustible (
    id_combustible serial PRIMARY KEY,
    tipo_comb character varying(50)
);

-- Crear la tabla "conductor"
CREATE TABLE IF NOT EXISTS public.conductor (
    id_conductor serial PRIMARY KEY,
    nombre_con character varying(50),
    apellido_con character varying(50),
    cedula_con character varying(20),
    numero_telefono_con character varying(15),
    correo_con character varying(50),
    fecha_de_nacimiento_con date
);

-- Crear la tabla "ubicacion"
CREATE TABLE IF NOT EXISTS public.ubicacion (
    id_ubicacion serial PRIMARY KEY,
    origen_ubi character varying(100),
    destino_ubi character varying(100)
);

-- Crear la tabla "vehiculo"
CREATE TABLE IF NOT EXISTS public.vehiculo (
    id_vehiculo serial PRIMARY KEY,
    placa_veh character varying(15),
    descripcion_veh character varying(100),
    chasis_veh character varying(30),
    marca_veh character varying(50),
    color_veh character varying(20),
    id_conductor integer REFERENCES public.conductor(id_conductor)
);

-- Crear la tabla "controlcombustible"
CREATE TABLE IF NOT EXISTS public.controlcombustible (
    id_controlcombustible serial PRIMARY KEY,
    fecha_control date,
    id_vehiculo integer REFERENCES public.vehiculo(id_vehiculo),
    descripcion_veh character varying(100),
    id_ubicacion integer REFERENCES public.ubicacion(id_ubicacion),
    km_inicial_controlc double precision,
    km_final_controlc double precision,
    km_recorrido_controlc double precision,
    galon_controlc double precision,
    valorcompra_controlc double precision,
    km_galon_controlc double precision,
    km_moneda_controlc double precision,
    id_combustible integer REFERENCES public.combustible(id_combustible),
    no_documento_controlc character varying(20),
    comentario_controlc character varying(50)
);

-- Crear las funciones (reemplaza con tus funciones específicas)
-- Ejemplo: CREATE FUNCTION nombre_de_tu_funcion() RETURNS void AS $$ -- Cuerpo de la función $$ LANGUAGE plpgsql;


TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.controlcombustible
    OWNER to postgres;

TAMBIEN VAMOS A CRAR LAS FUNCIONES QUE UTILIZAREMOS PARA QUE LOS PROCEDIMIENTOS SEAN MAS RAPIDO 

![image](https://github.com/GeovannyMolina25/ControlCombustible/assets/108442886/15628802-9907-42d4-bfce-160da6af80b1)


-- FUNCTION: public.ObtenerCombustibleId(integer)

-- DROP FUNCTION IF EXISTS public."ObtenerCombustibleId"(integer);

CREATE OR REPLACE FUNCTION public."ObtenerCombustibleId"(
	"codCombustible" integer)
    RETURNS character varying
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare 
combustibleId character varying;

BEGIN 
	select tipo_comb into combustibleId from Combustible where Id_combustible = "codCombustible";
	return combustibleId;
END;
$BODY$;

ALTER FUNCTION public."ObtenerCombustibleId"(integer)
    OWNER TO postgres;


![image](https://github.com/GeovannyMolina25/ControlCombustible/assets/108442886/f4e9dad0-7ff8-48fa-b58f-d1746c90768b)


-- FUNCTION: public.ObtenerConductorId(integer)

-- DROP FUNCTION IF EXISTS public."ObtenerConductorId"(integer);

CREATE OR REPLACE FUNCTION public."ObtenerConductorId"(
	"codConductor" integer)
    RETURNS character varying
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE 
    nombreId character varying;

BEGIN
    SELECT nombre_con INTO nombreId FROM Conductor WHERE Id_conductor = "codConductor";
    return nombreId;
END;
$BODY$;

ALTER FUNCTION public."ObtenerConductorId"(integer)
    OWNER TO postgres;


![image](https://github.com/GeovannyMolina25/ControlCombustible/assets/108442886/fa3e2da9-be6d-4b69-8e82-c922c13de7de)



-- FUNCTION: public.ObtenerConductorPorVehiculo(integer)

-- DROP FUNCTION IF EXISTS public."ObtenerConductorPorVehiculo"(integer);

CREATE OR REPLACE FUNCTION public."ObtenerConductorPorVehiculo"(
	"codVehiculo" integer)
    RETURNS TABLE(nombre_conductor character varying, apellido_conductor character varying, descripcion_vehiculo character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT
        c.nombre_con,
        c.apellido_con,
        v.descripcion_veh
    FROM
        conductor c
    INNER JOIN
        vehiculo v ON c.id_conductor = v.id_conductor
    WHERE
        v.id_vehiculo = "codVehiculo";
END;
$BODY$;

ALTER FUNCTION public."ObtenerConductorPorVehiculo"(integer)
    OWNER TO postgres;


![image](https://github.com/GeovannyMolina25/ControlCombustible/assets/108442886/fc5f8ffb-0d92-4d4d-9e82-58bb60b2e3b8)



-- Corregir la definición de la función
CREATE OR REPLACE FUNCTION public."ObtenerVehiculoPorDescripcion"(
    "descripcionVehiculo" character varying
)
RETURNS TABLE(placa_vehiculo character varying) 
LANGUAGE 'plpgsql'
COST 100
VOLATILE PARALLEL UNSAFE
ROWS 1000
AS $BODY$
BEGIN
    RETURN QUERY
    SELECT
        v.placa_veh
    FROM
        vehiculo v
    WHERE
        v.descripcion_veh = "descripcionVehiculo";
END;
$BODY$;

ALTER FUNCTION public."ObtenerVehiculoPorDescripcion"(character varying)
OWNER TO postgres;

![image](https://github.com/GeovannyMolina25/ControlCombustible/assets/108442886/c24b1268-8f0c-4e63-aa19-0ee7599f6866)

-- FUNCTION: public.ObtenerVehiculosPorConductor(integer)

-- DROP FUNCTION IF EXISTS public."ObtenerVehiculosPorConductor"(integer);

CREATE OR REPLACE FUNCTION public."ObtenerVehiculosPorConductor"(
	"codConductor" integer)
    RETURNS TABLE(id_vehiculo integer, placa_vehiculo character varying, descripcion_vehiculo character varying) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY
    SELECT
        v.id_vehiculo,
        v.placa_veh,
        v.descripcion_veh
    FROM
        vehiculo v
    WHERE
        v.id_conductor = "codConductor";
END;
$BODY$;

ALTER FUNCTION public."ObtenerVehiculosPorConductor"(integer)
    OWNER TO postgres;




