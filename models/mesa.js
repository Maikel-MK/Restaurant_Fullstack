const mongoose = require('mongoose')
const mesaRouter = require('../controllers/mesas')

const mesaSchema = new mongoose.Schema({
    mesa:Number,
    hora:String,
    pedidos:{
        producto:String,
        cantidad:Number,
        precio:Number,
        subtotal:Number,
    },
    propina:Number,
    total:Number

})

mesaSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const mesa = mongoose.model('Mesa', mesaSchema)   

module.exports = mesa