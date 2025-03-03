const express = require('express');
const mesaRouter = express.Router();
const Mesa = require('../models/mesa');

// Crear una nueva reserva de mesa
mesaRouter.post('/reservaMesa', async (request, response) => {
    console.log('Solicitud POST recibida en /api/mesas/reservaMesa'); // Log 1
    console.log('Datos recibidos:', request.body); // Log 2

    const { mesa, hora, pedidos, propina, total } = request.body;

    // Validar que todos los campos estén presentes
    if (!mesa || !hora || !pedidos || !propina || !total) {
        console.log('Error: Faltan campos obligatorios'); // Log 3
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

        console.log('Reserva guardada correctamente:', nuevaMesa); // Log 4
        return response.status(201).json({ message: 'Reserva guardada correctamente', data: nuevaMesa });
    } catch (error) {
        console.error('Error al guardar la reserva:', error.message); // Log 5
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

// Obtener una mesa por ID
mesaRouter.get('/obtener-mesa/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const mesa = await Mesa.findById(id);

        if (!mesa) {
            return response.status(404).json({ error: 'Mesa no encontrada' });
        }

        return response.status(200).json({ textOk: true, data: mesa });
    } catch (error) {
        console.error('Error al obtener la mesa:', error.message);
        return response.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener una mesa por número de mesa
mesaRouter.get('/obtener-mesa-por-mesa/:mesa', async (request, response) => {
    console.log('Solicitud recibida para obtener la mesa con número:', request.params.mesa);
    try {
        const mesaNumero = request.params.mesa;
        const mesa = await Mesa.findOne({ mesa: mesaNumero });

        if (!mesa) {
            return response.status(404).json({ error: 'Mesa no encontrada' });
        }

        return response.status(200).json({ textOk: true, data: mesa });
    } catch (error) {
        console.error('Error al obtener la mesa:', error.message);
        return response.status(500).json({ error: 'Error interno del servidor' });
    }
});


// Actualizar una mesa por ID
mesaRouter.put('/actualizar-mesa/:id', async (request, response) => {
    console.log('Solicitud PUT recibida en /api/mesas/actualizar-mesa/:id'); // Log 1
    console.log('ID de la mesa a actualizar:', request.params.id); // Log 2
    console.log('Datos recibidos:', request.body); // Log 3

    try {
        const id = request.params.id;
        const datosActualizados = request.body;

        const mesaActualizada = await Mesa.findByIdAndUpdate(id, datosActualizados, { new: true });

        if (!mesaActualizada) {
            console.log('Error: Mesa no encontrada'); // Log 4
            return response.status(404).json({ error: 'Mesa no encontrada' });
        }

        console.log('Reserva actualizada correctamente:', mesaActualizada); // Log 5
        return response.status(200).json({ message: 'Mesa actualizada correctamente', data: mesaActualizada });
    } catch (error) {
        console.error('Error al actualizar la mesa:', error.message); // Log 6
        return response.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = mesaRouter