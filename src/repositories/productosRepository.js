const Database = require('../models/database');

// Formatea el registro de Prisma para mantener consistencia con los CHAR recortados y el valor numérico
const formatProducto = (prod) => {
  if (!prod) return null;
  return {
    id_producto: prod.id_producto ? prod.id_producto.trim() : prod.id_producto,
    id_categoria: prod.id_categoria ? prod.id_categoria.trim() : prod.id_categoria,
    pro_descripcion: prod.pro_descripcion ? prod.pro_descripcion.trim() : prod.pro_descripcion,
    pro_precio_venta: prod.pro_precio_venta !== null && prod.pro_precio_venta !== undefined
      ? (typeof prod.pro_precio_venta.toNumber === 'function' ? prod.pro_precio_venta.toNumber() : String(prod.pro_precio_venta))
      : prod.pro_precio_venta,
  };
};

class ProductosRepository {
  constructor() {
    this.db = Database.getInstance().client;
  }

  async findAll(limit, offset) {
    const productos = await this.db.producto.findMany({
      skip: offset,
      take: limit,
      orderBy: { id_producto: 'asc' },
    });
    return productos.map(formatProducto);
  }

  async count() {
    return await this.db.producto.count();
  }

  async findById(id) {
    const producto = await this.db.producto.findUnique({
      where: { id_producto: id },
    });
    return formatProducto(producto);
  }

  async create(p) {
    const producto = await this.db.producto.create({
      data: {
        id_producto: p.id_producto,
        id_categoria: p.id_categoria,
        pro_descripcion: p.pro_descripcion,
        pro_precio_venta: p.pro_precio_venta,
      },
    });
    return formatProducto(producto);
  }

  async update(id, p) {
    try {
      const producto = await this.db.producto.update({
        where: { id_producto: id },
        data: {
          id_categoria: p.id_categoria,
          pro_descripcion: p.pro_descripcion,
          pro_precio_venta: p.pro_precio_venta,
        },
      });
      return formatProducto(producto);
    } catch (e) {
      if (e.code === 'P2025') return null; // Registro no encontrado en Prisma
      throw e;
    }
  }

  async patch(id, campos) {
    try {
      const data = {};
      if (campos.id_categoria !== undefined) data.id_categoria = campos.id_categoria;
      if (campos.pro_descripcion !== undefined) data.pro_descripcion = campos.pro_descripcion;
      if (campos.pro_precio_venta !== undefined) data.pro_precio_venta = campos.pro_precio_venta;

      const producto = await this.db.producto.update({
        where: { id_producto: id },
        data,
      });
      return formatProducto(producto);
    } catch (e) {
      if (e.code === 'P2025') return null; // Registro no encontrado en Prisma
      throw e;
    }
  }

  async delete(id) {
    try {
      await this.db.producto.delete({
        where: { id_producto: id },
      });
      return true;
    } catch (e) {
      if (e.code === 'P2025') return false; // Registro no encontrado
      throw e;
    }
  }
}

module.exports = new ProductosRepository();
