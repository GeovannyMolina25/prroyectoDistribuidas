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
-- Ejemplo: CREATE FUNCTION nombre_de_tu_funcion() RETURNS void AS $$ -- Cuerpo de la función $$ LANGUAGE plpgsql;

INSERT INTO combustible (tipo_comb)
VALUES 
    ('Diesel')
	
select * from combustible;

------------------------------------------Crear SP---------------------------------- 

--OBTENER COMBUSTIBLE ID

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

--OBTENER CONDUCTOR ID 

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

----OBTENER CONDUCTOR POR VEHICULO 


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

---OBTENER VEHICULO POR DESCRIPCION 

-- FUNCTION: public.ObtenerVehiculoPorDescripcion(character varying)

-- DROP FUNCTION IF EXISTS public."ObtenerVehiculoPorDescripcion"(character varying);

CREATE OR REPLACE FUNCTION public."ObtenerVehiculoPorDescripcion"(
	"descripcionVehiculo" character varying)
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


---OBTENER VEHICULO POR CONDUCTOR 

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
