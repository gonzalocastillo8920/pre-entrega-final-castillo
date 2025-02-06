import mongoose from "mongoose";

mongoose.connect("mongodb+srv://gonzaloCastillo:kakaroto@cluster0.k3r7j.mongodb.net/entregaFinal?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Base de datos conectada con exito!"))
    .catch((error) => console.log("Error en DB:" + error));