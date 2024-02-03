Database pgadmin4
postgresql

Crear una base de datos con el nombre : proyectogasolina


![image](https://github.com/GeovannyMolina25/ControlCombustible/assets/108442886/df4e9fab-f1a2-4486-8927-6901f9e61bdb)

para crear las tablas vamos a utilizar estas lineas de codigo en el SQL :

![image](https://github.com/GeovannyMolina25/ControlCombustible/assets/108442886/18ed7c56-b532-43b4-a96e-0aa60168c86c)

-- Table: public.combustible

-- DROP TABLE IF EXISTS public.combustible;

CREATE TABLE IF NOT EXISTS public.combustible
(
    id_combustible integer NOT NULL DEFAULT nextval('combustible_id_combustible_seq'::regclass),
    tipo_comb character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT combustible_pkey PRIMARY KEY (id_combustible)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.combustible
    OWNER to postgres;

    
![image](https://github.com/GeovannyMolina25/ControlCombustible/assets/108442886/a3b4af79-b891-44ef-a91c-594f04672691)


-- Table: public.conductor

-- DROP TABLE IF EXISTS public.conductor;

CREATE TABLE IF NOT EXISTS public.conductor
(
    id_conductor integer NOT NULL DEFAULT nextval('conductor_id_conductor_seq'::regclass),
    nombre_con character varying(50) COLLATE pg_catalog."default",
    apellido_con character varying(50) COLLATE pg_catalog."default",
    cedula_con character varying(20) COLLATE pg_catalog."default",
    numero_telefono_con character varying(15) COLLATE pg_catalog."default",
    correo_con character varying(50) COLLATE pg_catalog."default",
    fecha_de_nacimiento_con date,
    CONSTRAINT conductor_pkey PRIMARY KEY (id_conductor)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.conductor
    OWNER to postgres;
    
![image](https://github.com/GeovannyMolina25/ControlCombustible/assets/108442886/a60b1443-9bd2-4dc0-a17d-195a089bb60f)


-- Table: public.ubicacion

-- DROP TABLE IF EXISTS public.ubicacion;

CREATE TABLE IF NOT EXISTS public.ubicacion
(
    id_ubicacion integer NOT NULL DEFAULT nextval('ubicacion_id_ubicacion_seq'::regclass),
    origen_ubi character varying(100) COLLATE pg_catalog."default",
    destino_ubi character varying(100) COLLATE pg_catalog."default",
    CONSTRAINT ubicacion_pkey PRIMARY KEY (id_ubicacion)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.ubicacion
    OWNER to postgres;
    

![image](https://github.com/GeovannyMolina25/ControlCombustible/assets/108442886/5ef51589-d3b1-4ee5-8df4-8eb2b47677ec)


-- Table: public.vehiculo

-- DROP TABLE IF EXISTS public.vehiculo;

CREATE TABLE IF NOT EXISTS public.vehiculo
(
    id_vehiculo integer NOT NULL DEFAULT nextval('vehiculo_id_vehiculo_seq'::regclass),
    placa_veh character varying(15) COLLATE pg_catalog."default",
    descripcion_veh character varying(100) COLLATE pg_catalog."default",
    chasis_veh character varying(30) COLLATE pg_catalog."default",
    marca_veh character varying(50) COLLATE pg_catalog."default",
    color_veh character varying(20) COLLATE pg_catalog."default",
    id_conductor integer,
    CONSTRAINT vehiculo_pkey PRIMARY KEY (id_vehiculo),
    CONSTRAINT vehiculo_id_conductor_fkey FOREIGN KEY (id_conductor)
        REFERENCES public.conductor (id_conductor) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.vehiculo
    OWNER to postgres;


![image](https://github.com/GeovannyMolina25/ControlCombustible/assets/108442886/9a0b53f5-b5a4-41d1-9c0f-0fb1d4647368)



-- Table: public.controlcombustible

-- DROP TABLE IF EXISTS public.controlcombustible;

CREATE TABLE IF NOT EXISTS public.controlcombustible
(
    id_controlcombustible integer NOT NULL DEFAULT nextval('controlcombustible_id_controlcombustible_seq'::regclass),
    fecha_control date,
    id_vehiculo integer,
    descripcion_veh character varying(100) COLLATE pg_catalog."default",
    id_ubicacion integer,
    km_inicial_controlc double precision,
    km_final_controlc double precision,
    km_recorrido_controlc double precision,
    galon_controlc double precision,
    valorcompra_controlc double precision,
    km_galon_controlc double precision,
    km_moneda_controlc double precision,
    id_combustible integer,
    no_documento_controlc character varying(20) COLLATE pg_catalog."default",
    comentario_controlc character varying(50) COLLATE pg_catalog."default",
    CONSTRAINT controlcombustible_pkey PRIMARY KEY (id_controlcombustible),
    CONSTRAINT controlcombustible_id_combustible_fkey FOREIGN KEY (id_combustible)
        REFERENCES public.combustible (id_combustible) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT controlcombustible_id_vehiculo_fkey FOREIGN KEY (id_vehiculo)
        REFERENCES public.vehiculo (id_vehiculo) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

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




