const express = require('express');
const menuRouter = express.Router();
const Menu = require('../models/menu'); // Asegúrate de que el modelo esté correctamente importado

// Ruta para obtener todos los menús
menuRouter.get('/lista-menu', async (request, response) => {
    try {
        // Obtener todos los menús desde la base de datos
        const listado = await Menu.find();

        // Si no hay menús, devolver un mensaje indicando que no hay datos
        if (listado.length === 0) {
            return response.status(404).json({ textOk: false, message: 'No se encontraron menús' });
        }

        // Devolver la lista de menús
        return response.status(200).json({ textOk: true, data: listado });

    } catch (error) {
        // Manejar errores y devolver un mensaje de error
        console.error('Error al obtener la lista de menús:', error.message);
        return response.status(500).json({ textOk: false, error: 'Error interno del servidor' });
    }
});

//registrar lo que envia el usuario
// menuRouter.post('/registroUsuarios',(request,response)=>{
//     const {nombre,correo,password,password2,rol} = request.body
//     console.log(nombre,correo,password,password2,rol)

//     if(!nombre || !correo || !password || !password2 || !rol){

//         return response.status(400).json({error:'Los datos no pueden estar Incompletos'})
//     }else{
//         //guardar en la bd
//         let usuario = new menu()

//         usuario.nombre = nombre
//         usuario.correo = correo 
//         usuario.password = password
//         usuario.rol = rol
        

//         async function guardarUsuario() {
//             await usuario.save()
//             const usuarios = await menu.find()
//             console.log(usuarios)
//         }

//         guardarUsuario().catch(console.error)

//         return response.status(200).json({message:'Usuario Registrado Correctamente'})
//     }

// })

// //consultar un usuario
// menuRouter.get('/consultar-menu', async (request, response) => {
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
//             usuario = await menu.findById(id)
//         } else if (correo) {
//             console.log('Buscando usuario por correo:', correo) // Depuración
//             usuario = await menu.findOne({ correo: correo })
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
// menuRouter.post('/editar-menu', async(request,response)=>{

//     try {
//         const {id,nombre,correo,password,password2,rol} = request.body

//         if(!nombre && !correo && !password && !password2 && !rol){

//             return response.status(400).json({error:'Todos los campos son obligatorios'})
//         }else{
//             const updatemenu = await menu.findByIdAndUpdate({_id:id},{nombre:nombre,correo:correo,password:password,rol:rol})

//             await updatemenu.save()

//             return response.status(200).json({message:'Usuario editado correctamente'}) 
//         }

//     } catch (error) {
//         return response.status(400).json({error:'error al editar el usuario'})
//     }
// })

// //eliminar un usuario
// menuRouter.post('/eliminar-menu',async (request,response)=>{
//     const {id} = request.body	

//     try {
        
//         const usuario = await menu.deleteOne({_id:id})

//         return response.status(200).json({message:'Usuario eliminado correctamente'})

//     } catch (error) {
//         return response.status(400).json({error:'No se pudo eliminar el usuario'})
//     }
// })



// //verificar el Registro
// menuRouter.get('/validar-confirmacion/:correo',async (request,response)=>{

//     try {
//         const {correo} = response.param

//         console.log(correo)

//         //cerificar si existe el usuario

//         const usuario = await menu.findOne({correo:correo})

//         if(!usuario){
//             response.send('Error:El Usuario NO esta Registrado')
//         }else if(usuario.verified){

//                 response.send('Error: El Usuario Ya esta Verificado')

//         }else{
//             //actualizar Verificacion
//             const actualizarUsuario = await menu.findByIdAndUpdate({correo:correo},{verified:true})

//             await actualizarUsuario.save()

//             //redireccionar
//             // return response.redirect()
//         }

//     } catch (error) {
//         console.log(error)
//     }
// })

module.exports = menuRouter