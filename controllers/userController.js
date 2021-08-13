// Controller Eventos

// Importo bcrypt
const bcrypt = require("bcrypt");

// Importo JWT
const jwt = require("jsonwebtoken");

// Extraer variables de entorno
require("dotenv").config({ path : "variables.env"})

// Modelo event
const User = require("../models/user.js");

// Listar todos los eventos
exports.getUsers = async (req, res) => {
    try {
        const events = await User.find({});
        res.status(200).json(events);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Registro del usuario
exports.registerUser = async (req, res) => {
    try {
        // Valido que no se encuentren atributos diferentes
        for (const key in req.body) {
            const found = Object.keys(User.schema.paths).find(k => k === key);
            if (found === undefined) {
                throw {
                    errors: {
                        message: "El usuario no puede tener atributos diferentes a los definidos en el modelo.",
                        valueError: key
                    }
                };
            }
        }
        // Valido que el usuario ya existe
        const userExists = await User.findOne({
            userName: req.body.userName
        });
        if (userExists !== null) {
            throw {
                errors: {
                    message: "El usuario ya existe.",
                    valueError: req.body.userName
                }
            }
        };
        // Encriptacion de contraseña
        const password = await bcrypt.hash(req.body.password, 10);
        req.body.password = password
        // Otras validaciones se realizan en mongoose
        // Se crea y se guarda el documento
        const user = await User.create(req.body);
        res.status(200).json({
            message: "Usuario agregado correctamente"
        });
    } catch (err) {
        res.status(400).json(err.errors);
    }
};

// Login del usuario
exports.loginUser = async (req, res) => {
    // Verifico que se hayan enviado los parametros
    try {
        if (!req.body.userName || !req.body.password) {
            throw {
                errors: {
                    message: "El usuario y la contraseña son obligatorios."
                }
            }
        }
    } catch (err) {
        res.status(400).json(err.errors);
    };
    // Busco el usuario y comparo la contraseña encriptada
    const user = await User.findOne({
        userName: req.body.userName
    });
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(req.body.password, user.password);
    // Error de autenticacion
    if (!passwordCorrect) {
        res.status(401).json({
            message: "Usuario o contraseña incorrectos"
        });
    }

    // Creo el token JWT
    const userToken = jwt.sign({
        userName: user.userName,
        id : user._id
    }, process.env.APP_SECRET);

    // Usuario autenticado
    res.status(200).json({
        message: "Usuario autenticado correctamente",
        userName: req.body.userName,
        token: userToken
    });
}