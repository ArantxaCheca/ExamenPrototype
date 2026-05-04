// Importamos Express para crear la API.
import express from "express";

// Importamos el array de productos iniciales.
import { products } from "./product.js";

// Creamos la aplicación de Express.
const app = express();

// Definimos el puerto donde funcionará el servidor.
const PORT = 3000;

// Permitimos que Express lea JSON en el body de las peticiones.
app.use(express.json());

// GET /products: devuelve todos los productos.
app.get("/products", (req, res) => {
  res.json(products);
});

// GET /products/:id: devuelve un producto por su id.
app.get("/products/:id", (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
});

// POST /products: crea un nuevo producto.
app.post("/products", (req, res) => {
  const newProduct = {
    id: crypto.randomUUID(),
    name: req.body.name,
    price: req.body.price,
    stock: req.body.stock,
    is_active: req.body.is_active ?? true,
    created_at: new Date(),
    updated_at: new Date(),
  };

  products.push(newProduct);

  res.status(201).json(newProduct);
});

// PATCH /products/:id: actualiza un producto por su id.
app.patch("/products/:id", (req, res) => {
  const product = products.find((item) => item.id === req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product.name = req.body.name ?? product.name; // Solo actualizamos el campo si se proporciona en el body.
  product.price = req.body.price ?? product.price; // El operador nullish coalescing (??) asegura que si el valor es null o undefined, se mantenga el valor actual.
  product.stock = req.body.stock ?? product.stock; // De esta forma, si el cliente no envía un campo, no se sobrescribirá con undefined.
  product.is_active = req.body.is_active ?? product.is_active; // Lo mismo para el campo is_active.
  product.updated_at = new Date(); // Actualizamos la fecha de actualización.

  res.json(product); // Devolvemos el producto actualizado.
});

// DELETE /products/:id: elimina un producto por su id.
app.delete("/products/:id", (req, res) => {
  const index = products.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const deletedProduct = products.splice(index, 1);

  res.json(deletedProduct[0]);
});

// Iniciamos el servidor.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});