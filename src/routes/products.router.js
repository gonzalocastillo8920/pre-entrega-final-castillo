import express from "express";
import ProductManager from "../managers/product.manager.js";

const router = express.Router();
const manager = new ProductManager();

// mostrar Productos:
router.get("/", async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const productos = await manager.obtenerProductos({
            limit: limit,
            page: page, 
            sort,
            query
        });

        res.json({
            status: "success",
            payload: productos,
            totalPages: productos.totalPages,
            prevPage: productos.prevPage,
            nextPage: productos.nextPage,
            page: productos.page,
            hasPrevPage: productos.hasPrevPage,
            hasNextPage: productos.hasNextPage,
            prevLink: productos.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: productos.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        });
    } catch (error) {
        console.log("Error al cargar y mostrar los productos." + error);
        res.status(500).json({mensaje: "Error en Servidor/DB.", error});
    };
});

// Agregar un Producto Nuevo: 
router.post("/", async (req, res) => {
    const productoNuevo = req.body;

    try {
        await manager.agregarProducto(productoNuevo);
        res.json({mensaje: "Producto creado satisfactoriamente"});
    } catch (error) {
        console.log("Error creando el nuevo producto. " + error);
        res.status(500).json({mensaje: "Error en Servidor/DB.", error });
    };
});

// Actualizar Producto por ID:
router.put("/:pid", async (req, res) => {
    const productoId = req.params.pid;
    const productoActualizado = req.body;

    try {
        await manager.actualizarProductoPorId(productoId, productoActualizado);
        res.json({mensaje: "Producto actualizado con exito"});
    } catch (error) {
        console.log("Error al actualizar el producto. " + error);
        res.status(500).json({mensaje: "Error en Servidor/DB.", error });
    };
});

// Buscar un Producto por su ID:
router.get("/:pid", async (req, res) => {
    const productoId = req.params.pid;

    try {
        const productoBuscado = await manager.obtenerProductPorId(productoId);
        if(!productoBuscado){
            return res.json({mensaje: "No pudimos encontrar ese producto, verifique"});
        };
        res.json(productoBuscado);
    } catch (error) {
        console.log("Error al obtener el producto. " + error);
        res.status(500).json({mensaje: "Error en Servidor/DB.", error });
    };
});

// Eliminar un Producto:
router.delete("/:pid", async (req, res) => {
    const productoId = req.params.pid;

    try {
        await manager.eliminarProductoPorId(productoId);
        res.json({mensaje: "Producto eliminado satisfactoriamente"});
    } catch (error) {
        console.log("Error al eliminar el producto. " + error);
        res.status(500).json({mensaje: "Error en Servidor/DB.", error });
    }
});

export default router;