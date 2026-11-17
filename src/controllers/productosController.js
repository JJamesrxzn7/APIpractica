const repo = require("../repositories/productosRepository");

// El controlador solo maneja HTTP; nunca escribe SQL (usa el Repository).
const ok = (res, status, data, extra = {}) =>
  res.status(status).json({ success: true, data, ...extra });
const notFound = (res) =>
  res.status(404).json({ success: false, error: "Producto no encontrado" });

exports.list = async (req, res, next) => {
  try {
    const { page, limit, offset } = req.pagination;
    const [data, total] = await Promise.all([
      repo.findAll(limit, offset),
      repo.count(),
    ]);
    ok(res, 200, data, {
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (e) {
    next(e);
  }
};

exports.get = async (req, res, next) => {
  try {
    const p = await repo.findById(req.params.id);
    p ? ok(res, 200, p) : notFound(res);
  } catch (e) {
    next(e);
  }
};

exports.create = async (req, res, next) => {
  try {
    if (await repo.findById(req.body.id_producto)) {
      return res
        .status(400)
        .json({ success: false, error: "El id_producto ya existe" });
    }
    ok(res, 201, await repo.create(req.body));
  } catch (e) {
    next(e);
  }
};

exports.update = async (req, res, next) => {
  try {
    const p = await repo.update(req.params.id, req.body);
    p ? ok(res, 200, p) : notFound(res);
  } catch (e) {
    next(e);
  }
};

exports.patch = async (req, res, next) => {
  try {
    const p = await repo.patch(req.params.id, req.body);
    p ? ok(res, 200, p) : notFound(res);
  } catch (e) {
    next(e);
  }
};

exports.remove = async (req, res, next) => {
  try {
    (await repo.delete(req.params.id))
      ? ok(res, 200, { id_producto: req.params.id })
      : notFound(res);
  } catch (e) {
    next(e);
  }
};
