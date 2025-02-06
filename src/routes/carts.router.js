import express from "express";
import CartManager from "../managers/cart.manager.js";
import CartModel from "../models/cart.model.js";

const router = express.Router();
const manager = new CartManager();

// Creamos un nuevo carrito:
router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await manager.crearCarrito();
        res.json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({ mensaje: "Error en Servidor/DB." });
    };
});

// Listamos los productos que pertenecen a determinado carrito:
router.get("/:cid", async (req, res) => {
    const idCarrito = req.params.cid;

    try {
        const carrito = await CartModel.findById(idCarrito);

        if (!carrito) {
            console.log("No existe el carrito con el id seleccionado.");
            return res.status(404).json({ error: "Carrito no encontrado" });
        };
        return res.json(carrito.products);
    } catch (error) {
        res.status(500).json({ mensaje: "Error en Servidor/DB." });
    };
});

// agregar Productos a distintos Carritos:
router.post("/:cid/product/:pid", async (req, res) => {
    const idCarrito = req.params.cid;
    const idProducto = req.params.pid
    const quantity = req.body.quantity || 1;

    try {
        const actualizarCarrito = await manager.agregarProductoAlCarrito(idCarrito, idProducto, quantity);
        res.json(actualizarCarrito.products);
    } catch (error) {
        res.status(500).json({ mensaje: "Error en Servidor/DB." });
    };
});

// Eliminar un Producto del Carrito:
router.delete("/:cid/product/:pid", async (req, res) => {
    const idCarrito = req.params.cid;
    const idProducto = req.params.pid;

    try {
        const carritoAct = await manager.eliminarProductoDelCarrito(idCarrito, idProducto);
        res.json({
            status: "success",
            message: "Producto eliminado del carrito correctamente!",
            carritoAct
        });
    } catch (error) {
        res.status(500).json({ mensaje: "Error en Servidor/DB." });
    };
});

// Actualizar productos de un Carrito:
router.put("/:cid", async (req, res) => {
    const idCarrito = req.params.cid;
    const productoAct = req.body;

    try {
        const carrito = await manager.actualizarCarrito(idCarrito, productoAct);
        res.json(carrito);
    } catch (error) {
        console.log("Error actualizando el producto. " + error);
        res.status(500).json({ mensaje: "Error en Servidor/DB." })
    };
});

// Actualizar cantidad de un Producto especifico en un Carrito:
router.put("/:cid/product/:pid", async (req, res) => {
    try {
        const carritoID = req.params.cid;
        const cantidad = req.body.quantity;
        const productoID = req.params.pid;

        const carritoActualizado = await manager.actualizarCantidadDeProducto(carritoID, productoID, cantidad);
        res.json({
            status: "success",
            message: "Cantidad del producto elegido actualizada con exito.",
            carritoActualizado
        });
    } catch (error) {
        console.log("Error actualizando la cantidad del producto. " + error);
        res.status(500).json({ mensaje: "Error en Servidor/DB." })
    };
});

// Vaciar Carrito
router.delete("/:cid", async (req, res) => {
    const carritoID = req.params.cid;

    try {
        const carritoVacio = await manager.vaciarCarrito(carritoID);
        res.json({
            status: "success",
            messaje: "Carrito vaciado correctamente",
            carritoVacio
        });
    } catch (error) {
        console.log("Error vaciando el carrito. " + error);
        res.status(500).json({ mensaje: "Error en Servidor/DB." })
    }
});

export default router;