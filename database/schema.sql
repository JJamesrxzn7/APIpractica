CREATE TABLE IF NOT EXISTS productos (
    id_producto       CHAR(10)      PRIMARY KEY,
    id_categoria      CHAR(10)      NOT NULL,
    pro_descripcion   CHAR(40)      NOT NULL,
    pro_precio_venta  NUMERIC(7,2)  NOT NULL
);
