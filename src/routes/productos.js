const express = require('express');
const c = require('../controllers/productosController');
const { paginate, validateId, validateProducto } = require('../middlewares');

const router = express.Router();

// Cada ruta encadena sus eslabones antes del controlador (Chain of Responsibility).
router.get('/', paginate, c.list);
router.get('/:id', validateId, c.get);
router.post('/', validateProducto('create'), c.create);
router.put('/:id', validateId, validateProducto('update'), c.update);
router.patch('/:id', validateId, validateProducto('patch'), c.patch);
router.delete('/:id', validateId, c.remove);

module.exports = router;
