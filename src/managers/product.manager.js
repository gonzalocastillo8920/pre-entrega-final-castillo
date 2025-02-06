import ProductModel from "../models/product.model.js"

class ProductManager {

    // Metodo para obtener Todos los Productos:
    async obtenerProductos({ limit = 10, page = 1, sort, query } = {}) {

        try {
            const skip = (page - 1) * limit;

            let queryOptions = {};
            if (query) {
                queryOptions = { category: query };
            };

            const sortOptions = {};
            if (sort) {
                if (sort === "asc" || sort === "desc") {
                    sortOptions.price = sort === "asc" ? 1 : -1;
                };
            };

            const productos = await ProductModel
                .find(queryOptions)
                .sort(sortOptions)
                .skip(skip)
                .limit(limit)

            const totalProductos = await ProductModel.countDocuments(queryOptions);

            const totalPages = Math.ceil(totalProductos / limit);
            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;

            return {
                docs: productos,
                totalPages,
                prevPage: hasPrevPage ? page - 1 : null,
                nextPage: hasNextPage ? page + 1 : null,
                page,
                hasPrevPage,
                hasNextPage,
                prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
                nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
            };
        } catch (error) {
            console.log("Error al cargar los productos. " + error);
            throw error;
        };
    };

    // Metodo para Agregar un Producto:
    async agregarProducto({ code, title, price, category, thumbnails, stock, description, status }) {

        try {

            if (!code || !title || !description || !price || !stock || !category || status) {
                console.log("Todos los campos son obligatorios!");
                return;
            };

            const existeProducto = await ProductModel.findOne({ code: code });

            if (existeProducto) {
                console.log("El codigo del Producto ya existe!");
                return;
            };

            const producto = new ProductModel({
                code,
                title,
                price,
                category,
                thumbnails: thumbnails || [],
                stock,
                description,
                status: true
            });

            await producto.save();

        } catch (error) {
            console.log("Error al agregar el producto. " + error);
            throw error;
        };
    };

    // Metodo para Obtener un Producto por ID:
    async obtenerProductPorId(idProducto) {
        try {
            const producto = await ProductModel.findById(idProducto);
            if (!producto) {
                console.log("Producto no encontrado.");
                return null;
            };
            return producto;
        } catch (error) {
            console.log("Error al buscar el producto." + error);
            throw error;
        };
    };

    // Metodo para Actualizar un Producto:
    async actualizarProductoPorId(idProducto, productoAct) {
        try {
            const productoActualizado = await ProductModel.findByIdAndUpdate(idProducto, productoAct);
            if (!productoActualizado) {
                console.log("No se encuentra el producto");
                return null;
            };
            console.log("Producto actualizado!");
            
            return productoActualizado;
        } catch (error) {
            console.log("Error al actualizar el producto. " + error);
            throw error;
        }
    };

    // Metodo para eliminar un producto por ID:
    async eliminarProductoPorId(idProducto) {
        try {
            const producto = await ProductModel.findByIdAndDelete(idProducto);

            if (!producto) {
                console.log("El producto seleccionado no existe.");
                return null;
            };
            console.log("Producto eliminado correctamente!");
        } catch (error) {
            console.log("Error al eliminar el producto. " + error);
            throw error;
        };
    };
};

export default ProductManager;