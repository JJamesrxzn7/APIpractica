const path = require("path");
const express = require("express");
const mw = require("./middlewares");
const productosRoutes = require("./routes/productos");

const app = express();

// Cadena global: cors -> logger -> json -> auth -> rutas -> 404 -> errorHandler
app.use(mw.cors);
app.use(mw.logger);
app.use(express.json());
// Frontend estatico (publico): se sirve antes de auth; la API sigue protegida.
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(mw.auth);
app.use("/api/Productos", productosRoutes);
app.use(mw.notFoundHandler);
app.use(mw.errorHandler);

module.exports = app;
