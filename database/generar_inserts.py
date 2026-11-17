import os
import random

random.seed(42)
TOTAL = 10000

# id_categoria: (nombre, [(producto, precio_min, precio_max)], marcas, variantes)
CATEGORIAS = {
    "Lacteos": ("Lacteos", [("Leche entera", 0.9, 1.8), ("Yogurt", 0.8, 3.5), ("Queso fresco", 2.5, 7), ("Mantequilla", 1.5, 4), ("Crema de leche", 1, 3)],
                   ["Vita", "Toni", "Nutri", "Parmalat", "Alpina", "Rey Leche"], ["500ml", "1L", "200g", "400g", "light", "deslactosado"]),
    "Bebidas": ("Bebidas", [("Gaseosa", 0.6, 3), ("Jugo de naranja", 0.8, 3), ("Agua mineral", 0.5, 1.5), ("Te helado", 0.8, 2.5), ("Cerveza", 1, 3), ("Bebida energetica", 1.2, 3.5)],
                   ["Coca Cola", "Pepsi", "Pilsener", "Tesalia", "Guitig", "Fuze Tea", "Del Valle"], ["350ml", "500ml", "1L", "2L", "zero", "retornable"]),
    "Abarrotes": ("Abarrotes", [("Arroz", 0.9, 2.5), ("Azucar", 0.8, 2), ("Aceite de cocina", 2, 6), ("Fideos", 0.6, 2), ("Atun en lata", 1, 2.5), ("Harina de trigo", 0.8, 2.5), ("Lenteja", 1, 2.5), ("Sal", 0.4, 1)],
                   ["Gustadina", "Sucesor", "La Favorita", "Real", "Oriental", "Facundo", "Ales"], ["1kg", "2kg", "500g", "900ml", "3L", "premium", "integral"]),
    "Limpieza": ("Limpieza", [("Detergente en polvo", 2, 9), ("Lavavajillas", 1, 4), ("Cloro", 0.8, 3), ("Desinfectante", 1.2, 5), ("Suavizante", 2, 7), ("Jabon de barra", 0.5, 1.5)],
                   ["Deja", "Ariel", "Fabuloso", "Lava", "Ayudin", "Suavitel"], ["500g", "1kg", "2kg", "1L", "3L", "lavanda", "limon"]),
    "Higiene": ("Cuidado personal", [("Shampoo", 2, 8), ("Jabon de tocador", 0.6, 2), ("Pasta dental", 1, 4), ("Desodorante", 2, 6), ("Crema corporal", 3, 9), ("Papel higienico", 2, 8)],
                   ["Head Shoulders", "Dove", "Colgate", "Rexona", "Nivea", "Pantene", "Familia"], ["200ml", "400ml", "100g", "x4", "x12", "hidratante", "familiar"]),
    "Snacks": ("Snacks y dulces", [("Papas fritas", 0.5, 2.5), ("Galletas", 0.4, 2), ("Chocolate", 0.6, 4), ("Caramelos", 0.3, 2), ("Chifles", 0.5, 1.5), ("Barra de cereal", 0.5, 1.5)],
                   ["Frito Lay", "Nestle", "Ricacao", "Maxi", "Oreo", "Ritz", "Tosh"], ["30g", "100g", "250g", "x6", "x12", "sal", "chocolate"]),
    "Carnes": ("Carnes y embutidos", [("Pechuga de pollo", 3, 8), ("Salchicha", 1.5, 4), ("Jamon", 2, 6), ("Chorizo", 2, 5), ("Carne molida", 3, 7), ("Mortadela", 1.5, 4)],
                   ["Pronaca", "Plumrose", "Don Diego", "Mr. Pollo", "San Isidro", "Fritz"], ["500g", "1kg", "250g", "x8", "premium", "ahumado"]),
    "Frutas": ("Frutas y verduras", [("Banano", 0.5, 1.5), ("Tomate riÃ±on", 0.6, 2), ("Cebolla paiteÃ±a", 0.6, 2), ("Papa chola", 0.5, 1.8), ("Manzana", 1, 3), ("Aguacate", 1, 3), ("Zanahoria", 0.5, 1.5)],
                   ["Organico", "Fresco", "Selecto", "Nacional", "Importado"], ["1kg", "2kg", "libra", "funda", "grande", "mediano"]),
    "Panaderia": ("Panaderia", [("Pan de molde", 1.5, 3.5), ("Pan integral", 1.8, 4), ("Tortillas", 1, 3), ("Pastel", 3, 12), ("Croissant", 0.5, 1.5), ("Pan de agua", 0.15, 0.5)],
                   ["Bimbo", "Supan", "Moldepan", "Artesanal", "Tia"], ["x6", "x12", "grande", "integral", "familiar", "light"]),
    "Papeleria": ("Papeleria", [("Cuaderno", 0.8, 4), ("Esfero", 0.25, 1), ("Lapiz", 0.2, 0.8), ("Resma de papel", 3.5, 6), ("Marcador", 0.5, 2), ("Carpeta", 0.4, 2), ("Borrador", 0.2, 0.7)],
                   ["Norma", "Bic", "Faber Castell", "Paper Mate", "Pelikan", "Artesco"], ["100 hojas", "A4", "x12", "azul", "negro", "rojo", "x24"]),
}

ids_cat = list(CATEGORIAS)
filas = []

while len(filas) < TOTAL:
    cid = random.choice(ids_cat)
    _, prods, marcas, variantes = CATEGORIAS[cid]
    prod, pmin, pmax = random.choice(prods)
    desc = f"{prod} {random.choice(marcas)} {random.choice(variantes)}"[:40]
    precio = round(random.uniform(pmin, pmax), 2)
    filas.append((cid, desc, precio))

lineas = [
    "-- Script generado: 10000 productos coherentes por categoria",
    "-- Tabla: productos(id_producto char(10), id_categoria char(10), pro_descripcion char(40), pro_precio_venta numeric(7,2))",
    "BEGIN;",
    "",
]
for i, (cid, desc, precio) in enumerate(filas, 1):
    desc = desc.replace("'", "''")
    lineas.append(
        f"INSERT INTO productos (id_producto, id_categoria, pro_descripcion, pro_precio_venta) "
        f"VALUES ('PRO{i:07d}', '{cid}', '{desc}', {precio:.2f});"
    )
lineas += ["", "COMMIT;", ""]

with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "inserts_productos.sql"), "w", encoding="utf-8") as f:
    f.write("\n".join(lineas))
print(len(filas), "inserts generados")



