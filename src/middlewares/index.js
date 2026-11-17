const crypto = require("crypto");
const config = require("../config");

// PATRON CHAIN OF RESPONSIBILITY: cada middleware es un eslabon que procesa la
// peticion y llama next() para pasarla al siguiente, o la corta respondiendo.
// Orden: cors -> logger -> auth -> paginacion/validacion/hash -> controlador -> errorHandler.

// 1. CORS
const cors = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
};

// 2. Logs
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

// 3. Auth: espera "Authorization: Bearer <token>"
const auth = (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (token !== config.apiToken) {
    return res.status(401).json({ success: false, error: "No autorizado" });
  }
  next();
};

// 4. Validacion de datos
const bad = (res, error) => res.status(400).json({ success: false, error });
const isPrice = (v) =>
  typeof v === "number" && isFinite(v) && v >= 0 && v < 100000;
const RULES = {
  id_producto: (v) =>
    typeof v === "string" && v.trim().length > 0 && v.length <= 10,
  id_categoria: (v) =>
    typeof v === "string" && v.trim().length > 0 && v.length <= 10,
  pro_descripcion: (v) =>
    typeof v === "string" && v.trim().length > 0 && v.length <= 40,
  pro_precio_venta: isPrice,
};

const validateId = (req, res, next) =>
  req.params.id && req.params.id.length <= 10
    ? next()
    : bad(res, "id invalido (maximo 10 caracteres)");

const validateProducto = (modo) => (req, res, next) => {
  const body = req.body || {};
  const campos =
    modo === "create"
      ? Object.keys(RULES)
      : ["id_categoria", "pro_descripcion", "pro_precio_venta"];
  if (modo === "patch") {
    const enviados = Object.keys(body);
    if (!enviados.length) return bad(res, "Debe enviar al menos un campo");
    const invalidos = enviados.filter(
      (k) => !campos.includes(k) || !RULES[k](body[k]),
    );
    if (invalidos.length)
      return bad(res, `Campos invalidos: ${invalidos.join(", ")}`);
    return next();
  }
  const invalidos = campos.filter((k) => !RULES[k](body[k]));
  if (invalidos.length)
    return bad(res, `Campos invalidos o faltantes: ${invalidos.join(", ")}`);
  next();
};

// 5. Paginacion: por defecto 10, maximo estricto 100
const paginate = (req, res, next) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(
    Math.max(parseInt(req.query.limit, 10) || 10, 1),
    config.maxPageSize,
  );
  req.pagination = { page, limit, offset: (page - 1) * limit };
  next();
};

// 6. Hash: cifra con scrypt los campos indicados si vienen en el body
const hashFields =
  (...fields) =>
  (req, res, next) => {
    for (const f of fields) {
      if (req.body && typeof req.body[f] === "string") {
        const salt = crypto.randomBytes(16).toString("hex");
        req.body[f] =
          `${salt}:${crypto.scryptSync(req.body[f], salt, 32).toString("hex")}`;
      }
    }
    next();
  };

// 7. Gestion de errores (ultimo eslabon)
const notFoundHandler = (req, res) =>
  res.status(404).json({ success: false, error: "Ruta no encontrada" });

const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (err.type === "entity.parse.failed") return bad(res, "JSON invalido");
  const status =
    err.status || (err.code && /^(22|23)/.test(err.code) ? 400 : 500);
  res.status(status).json({
    success: false,
    error: status === 500 ? "Error interno del servidor" : err.message,
  });
};

module.exports = {
  cors,
  logger,
  auth,
  validateId,
  validateProducto,
  paginate,
  hashFields,
  notFoundHandler,
  errorHandler,
};
