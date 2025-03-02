const mongoose = require('mongoose')
const menuRouter = require('../controllers/menus')

// Definir el esquema del menú
const menuSchema = new mongoose.Schema({
    id: Number,
    nombre: {
        type: String,
        required: [true, 'El nombre del menú es obligatorio'], // Validación: nombre es requerido
        trim: true // Elimina espacios en blanco al inicio y final
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'], // Validación: precio es requerido
        min: [0, 'El precio no puede ser negativo'] // Validación: precio mínimo es 0
    },
    categoria: {
        type: Number,
        required: [true, 'La categoría es obligatoria'] // Validación: categoría es requerida
    }
});

// Transformar el objeto devuelto por Mongoose
menuSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString(); // Convertir _id a id
        delete returnedObject._id; // Eliminar _id
        delete returnedObject.__v; // Eliminar __v
    }
});

// Crear el modelo Menu basado en el esquema
const Menu = mongoose.model('Menu', menuSchema);

// Exportar el modelo
module.exports = Menu;