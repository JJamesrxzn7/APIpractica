const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");

describe("APIArqui - Pruebas Unitarias y de Integración", () => {
  const token = process.env.API_TOKEN || "secreto123";

  test("Seguridad: Rechaza peticiones sin token de autenticación (401)", async () => {
    const res = await request(app).get("/api/Productos");
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  test("Frontend Estático: Sirve correctamente index.html público (200)", async () => {
    const res = await request(app).get("/");
    assert.equal(res.status, 200);
  });

  test("Rutas: Manejo de rutas inexistentes (404)", async () => {
    const res = await request(app)
      .get("/api/RutaInexistente")
      .set("Authorization", `Bearer ${token}`);
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
  });

  test("Validación: Rechaza crear producto con payload inválido (400)", async () => {
    const res = await request(app)
      .post("/api/Productos")
      .set("Authorization", `Bearer ${token}`)
      .send({ id_producto: "" });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });
});
