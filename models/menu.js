const mongoose = require('mongoose')
const infoRouter = require('../controllers/inforM')

const informacionSchema = new mongoose.Schema({
    titulo: String,
    contenido: String,
    fecha: {
        type: Date,
        default: Date.now
    }
})

informacionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Informacion = mongoose.model('Informacion', informacionSchema)   

module.exports = Informacion