const mongoose = require('mongoose')
const mesaRouter = require('../controllers/mesas')

const mesaSchema = new mongoose.Schema({
    mesa: {
        type: Number,
        required: [true, 'El número de mesa es obligatorio'],
        min: [1, 'El número de mesa debe ser mayor que 0']
    },
    hora: {
        type: String,
        required: [true, 'La hora es obligatoria']
    },
    pedidos: [{
        id: Number,
        producto: {
            type: String,
            required: [true, 'El nombre del producto es obligatorio']
        },
        cantidad: {
            type: Number,
            required: [true, 'La cantidad es obligatoria'],
            min: [1, 'La cantidad debe ser mayor que 0']
        },
        precio: {
            type: Number,
            required: [true, 'El precio es obligatorio'],
            min: [0, 'El precio no puede ser negativo']
        },
        subtotal: {
            type: Number,
            required: [true, 'El subtotal es obligatorio'],
            min: [0, 'El subtotal no puede ser negativo']
        }
    }],
    propina: {
        type: Number,
        required: [true, 'La propina es obligatoria'],
        min: [0, 'La propina no puede ser negativa']
    },
    total: {
        type: Number,
        required: [true, 'El total es obligatorio'],
        min: [0, 'El total no puede ser negativo']
    }
});

mesaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

const Mesa = mongoose.model('Mesa', mesaSchema);

module.exports = Mesa;