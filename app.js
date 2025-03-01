require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
//const userRouter = require('./controllers/users');


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
//app.use('/api/users',userRouter)


module.exports = app;