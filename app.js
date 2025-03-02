require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const menuRouter = require('./controllers/menus');
const mesaRouter = require('./controllers/mesas');


//coneccion a BD

(async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Te has Conectado a MongoDB')
    } catch (error) {
        console.log(error)
    }
})()


//rutas FRONTEND
app.use('/',express.static(path.resolve('views','home')))


//las rutas que colocamos seran mediante express con json

app.use(express.json())


//Rutes BACKEND
app.use('/api/menus',require('./controllers/menus'))
app.use('/api/mesas',require('./controllers/mesas'))


module.exports = app;