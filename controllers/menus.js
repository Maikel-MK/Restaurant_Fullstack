const express = require('express')
const menuRouter = express.Router()
const Menu = require('../models/menu') // Asegúrate de que el modelo esté correctamente importado

// Ruta para obtener todos los menús
menuRouter.get('/lista-menu', async (request, response) => {
    try {
        // Obtener todos los menús desde la base de datos
        const listado = await Menu.find()

        // Si no hay menús, devolver un mensaje indicando que no hay datos
        if (listado.length === 0) {
            return response.status(404).json({ textOk: false, message: 'No se encontraron menús' })
        }

        // Devolver la lista de menús
        return response.status(200).json({ textOk: true, data: listado })

    } catch (error) {
        // Manejar errores y devolver un mensaje de error
        console.error('Error al obtener la lista de menús:', error.message)
        return response.status(500).json({ textOk: false, error: 'Error interno del servidor' })
    }
})

module.exports = menuRouter