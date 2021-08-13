const Mongoose = require('mongoose');

// Extrar variables de entorno
require("dotenv").config({ path : "variables.env"})

Mongoose.connect(process.env.URL_MONGO, { useNewUrlParser: true, useUnifiedTopology : true, useCreateIndex : true, useFindAndModify: false});

const db = Mongoose.connection;
    db.on('error', console.error.bind(console, 'Error en la conexion a mongoDB'));
    db.once('open', function () {
        console.log('Se conecto a mongoDB');
});

module.exports = db;
