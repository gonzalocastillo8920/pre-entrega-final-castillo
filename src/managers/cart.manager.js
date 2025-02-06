import CartModel from "../models/cart.model.js";

class CartManager {

    // Metodo de Crear Carrito:
    async crearCarrito() {
        try {
            const nuevoCarrito = new CartModel({ products: [] });
            await nuevoCarrito.save();
            return nuevoCarrito;
        } catch (error) {
            console.log("Error al crear un nuevo carrito");
        };
    };

    // Metodo de Obtener Carrito por su ID:
    async obtenerCarritoPorId(idCarrito) {
        try {
            const carrito = await CartModel.findById(idCarrito);
            if (!carrito) {
                console.log("No existe un carrito con el id: " + idCarrito);
                return null;
            };
            return carrito;
        } catch (error) {
            console.log("Error al retornar el carrito por ID " + error);
        };
    };

    // Metodo de Agregar Producto al Carrito:
    async agregarProductoAlCarrito(idCarrito, idProducto, quantity = 1) {
        try {
            const carrito = await this.obtenerCarritoPorId(idCarrito);
            const existeProducto = carrito.products.find(id => id.product.toString() === idProducto);

            if(existeProducto){
                existeProducto.quantity += quantity;
            } else {
                carrito.products.push({product: idProducto, quantity});
            };

            carrito.markModified("products");
            await carrito.save();
            return carrito;

        } catch (error) {
            console.log("error al cargar un producto " + error);
        };
    };

    // Metodo de Vaciar Carrito por ID:
    async vaciarCarrito(idCarrito) {
        try {
            const carrito = await CartModel.findByIdAndUpdate(idCarrito, {products: []}, {new: true});
            return carrito;
        } catch (error) {
            console.log("Error al vaciar carrito " + error);
        };
    };

    // Metodo de Actualizar Cantidad de un Producto del Carrito:
    async actualizarCantidadDeProducto(idCarrito, idProducto, nuevaCantidad){
        try {
            const carrito = await CartModel.findById(idCarrito);
            const indiceProducto = carrito.products.findIndex(id => id.product._id.toString() === idProducto);

            if(indiceProducto !== -1) {
                carrito.products[indiceProducto].quantity = nuevaCantidad;
                carrito.markModified("products");
                await carrito.save();
                return carrito;

            } else throw new Error("El producto no se encuentra en el carrito, debes agregarlo antes.");

        } catch (error) {
            console.log("Error al actualizar la cantidad de un producto en el carrito seleccionado " + error);
            throw error;
        }
    };

    // Metodo para Actualizar un Carrito:
    async actualizarCarrito(idCarrito, productosAct) {
        try {
            const carrito = await CartModel.findById(idCarrito);
            if(!carrito) throw new Error ("Carrito no encontrado");

            carrito.products = productosAct;
            carrito.markModified("products");
            await carrito.save();
            return carrito;

        } catch (error) {
            console.log("Error al actualizar el carrito " + error);
            throw error;            
        };
    };

    // Metodo para eliminar un Producto del Carrito:
    async eliminarProductoDelCarrito(idCarrito, idProducto){
        try {
            const carrito = await CartModel.findById(idCarrito);
            if(!carrito) throw new Error ("Carrito no encontrado");

            carrito.products = carrito.products.filter(item => item.product._id.toString() !== idProducto);
            await carrito.save();
            return carrito;

        } catch (error) {
            console.log("Error al eliminar el producto del carrito " + error);
            throw error;
        };
    };
};

export default CartManager;