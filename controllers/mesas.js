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


// //consultar un usuario
// mesaRouter.get('/consultar-mesa', async (request, response) => {
//     try {
//         const { id, correo } = request.query
//         console.log('Parámetros recibidos:', { id, correo }) // Depuración

//         // Validar que se proporcione al menos un parámetro (id o correo)
//         if (!id && !correo) {
//             return response.status(400).json({ error: 'Se requiere el ID o el correo del usuario.' })
//         }

//         let usuario

//         // Buscar el usuario por ID o correo
//         if (id) {
//             console.log('Buscando usuario por ID:', id) // Depuración
//             usuario = await mesa.findById(id)
//         } else if (correo) {
//             console.log('Buscando usuario por correo:', correo) // Depuración
//             usuario = await mesa.findOne({ correo: correo })
//         }

//         console.log('Usuario encontrado:', usuario) // Depuración

//         // Verificar si el usuario fue encontrado
//         if (!usuario) {
//             return response.status(404).json({ error: 'Usuario no encontrado.' })
//         }

//         // Devolver el usuario encontrado
//         return response.status(200).json({ textOk: true, data: usuario })
//     } catch (error) {
//         console.error('Error al consultar el usuario:', error)
//         return response.status(500).json({ error: 'Error interno del servidor.' })
//     }
// })

// //editar un usuario
// mesaRouter.post('/editar-mesa', async(request,response)=>{

//     try {
//         const {id,nombre,correo,password,password2,rol} = request.body

//         if(!nombre && !correo && !password && !password2 && !rol){

//             return response.status(400).json({error:'Todos los campos son obligatorios'})
//         }else{
//             const updatemesa = await mesa.findByIdAndUpdate({_id:id},{nombre:nombre,correo:correo,password:password,rol:rol})

//             await updatemesa.save()

//             return response.status(200).json({message:'Usuario editado correctamente'}) 
//         }

//     } catch (error) {
//         return response.status(400).json({error:'error al editar el usuario'})
//     }
// })

// //eliminar un usuario
// mesaRouter.post('/eliminar-mesa',async (request,response)=>{
//     const {id} = request.body	

//     try {
        
//         const usuario = await mesa.deleteOne({_id:id})

//         return response.status(200).json({message:'Usuario eliminado correctamente'})

//     } catch (error) {
//         return response.status(400).json({error:'No se pudo eliminar el usuario'})
//     }
// })

// //obtener todos los usuarios
// mesaRouter.get('/lista-mesa',async (request,response)=>{

//     try {
//         const listado = await mesa.find()

//         return response.status(200).json({textOk:true,data:listado})

//     } catch (error) {
//         return response.status(400).json({error:'No se pudo obtener la lista de usuarios'})
//     }
// })

// //verificar el Registro
// mesaRouter.get('/validar-confirmacion/:correo',async (request,response)=>{

//     try {
//         const {correo} = response.param

//         console.log(correo)

//         //cerificar si existe el usuario

//         const usuario = await mesa.findOne({correo:correo})

//         if(!usuario){
//             response.send('Error:El Usuario NO esta Registrado')
//         }else if(usuario.verified){

//                 response.send('Error: El Usuario Ya esta Verificado')

//         }else{
//             //actualizar Verificacion
//             const actualizarUsuario = await mesa.findByIdAndUpdate({correo:correo},{verified:true})

//             await actualizarUsuario.save()

//             //redireccionar
//             // return response.redirect()
//         }

//     } catch (error) {
//         console.log(error)
//     }
// })


module.exports = mesaRouter