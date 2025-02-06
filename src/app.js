import express from "express";
import carritoRouter from "./routes/carts.router.js";
import productosRouter from "./routes/products.router.js";
import viewsRouter from "./routes/views.router.js"
import { engine } from "express-handlebars";

import "./database.js";

const app = express();
const PUERTO = 8080;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./src/public"));

// Express-Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

// Rutas
app.use("/api/products", productosRouter);
app.use("/api/carts", carritoRouter);
app.use("/", viewsRouter);


app.listen(PUERTO, () => {
    console.log(`Escuchando el puerto: ${ PUERTO }`);
});