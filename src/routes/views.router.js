import express from "express";
import ProductManager from "../managers/product.manager.js";
import CartManager from "../managers/cart.manager.js";

const router = express.Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Mostrar Todos los Productos:
router.get("/products", async (req, res) => {
    try {
        const { page = 1, limit = 3 } = req.query;

        const productos = await productManager.obtenerProductos({
            page: parseInt(page),
            limit: parseInt(limit)
        });

        const todosProductos = productos.docs.map(producto => {
            const { _id, ...rest } = producto.toObject();
            return rest;
        });

        res.render("products", {
            productos: todosProductos,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            currentPage: productos.page,
            totalPages: productos.totalPages
        });

    } catch (error) {
        console.log("Error al obtener los productos. " + error);
        res.status(500).json({ mensaje: "Error en Servidor/DB.", error });
    };
});

// Mostrar un Carrito por su ID:
router.get("/carts/:cid", async (req, res) => {
    const carritoId = req.params.cid;

    try {
        const carrito = await cartManager.obtenerCarritoPorId(carritoId);

        if (!carrito) {
            console.log("No existe el carrito con ese Id. " + error);
            return res.status({ mensaje: "Carrito no encontrado.", error });
        };

        const productosCarrito = carrito.products.map(p => ({
            product: p.product.toObject(),
            quantity: p.quantity
        }));

        res.render("carts", {productos: productosCarrito,});

    } catch (error) {
        console.log("Error obteniendo el carrito. " + error);
        res.status(500).json({mensaje: "Error en Servidor/DB.", error });
    };
});

export default router;