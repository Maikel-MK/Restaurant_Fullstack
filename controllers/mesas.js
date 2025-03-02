const express = require('express');
const mesaRouter = express.Router();
const Mesa = require('../models/mesa');

// Registrar una nueva reserva de mesa
mesaRouter.post('/reservaMesa', async (request, response) => {
    const { mesa, hora, pedidos, propina, total } = request.body;

    // Validar que todos los campos estén presentes
    if (!mesa || !hora || !pedidos || !propina || !total) {
        return response.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Crear una nueva instancia de Mesa
        const nuevaMesa = new Mesa({
            mesa,
            hora,
            pedidos,
            propina,
            total
        });

        // Guardar en la base de datos
        await nuevaMesa.save();

        // Devolver una respuesta exitosa
        return response.status(201).json({ message: 'Reserva guardada correctamente', data: nuevaMesa });
    } catch (error) {
        console.error('Error al guardar la reserva:', error.message);
        return response.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener todas las mesas reservadas
mesaRouter.get('/lista-mesas', async (request, response) => {
    try {
        const mesas = await Mesa.find();
        return response.status(200).json({ textOk: true, data: mesas });
    } catch (error) {
        console.error('Error al obtener las mesas:', error.message);
        return response.status(500).json({ error: 'Error interno del servidor' });
    }
});
// Eliminar una mesa por ID
mesaRouter.delete('/eliminar-mesa/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const mesaEliminada = await Mesa.findByIdAndDelete(id);

        if (!mesaEliminada) {
            return response.status(404).json({ error: 'Mesa no encontrada' });
        }

        return response.status(200).json({ message: 'Mesa eliminada correctamente', data: mesaEliminada });
    } catch (error) {
        console.error('Error al eliminar la mesa:', error.message);
        return response.status(500).json({ error: 'Error interno del servidor' });
    }
});
module.exports = mesaRouter