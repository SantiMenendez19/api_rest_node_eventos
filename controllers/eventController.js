// Controller Eventos

// Modelo event
const Schemas = require("../models/event.js");
const User = require("../models/user.js");

// Imports
const jwt = require("jsonwebtoken");

// Extraer variables de entorno
require("dotenv").config({ path: "variables.env" })

// Listar todos los eventos
exports.getEvents = async (req, res) => {
    try {
        const events = await Schemas.Event.find({});
        res.status(200).json(events);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Obtener evento (detalle) por ID
exports.getEventId = async (req, res) => {
    try {
        const event = await Schemas.Event.find({ _id: req.params.id });
        if (event.length === 0) {
            throw {
                message: "Evento no encontrado",
                valueError: req.params.id
            };
        }
        res.status(200).json(event[0]);
    }
    catch (err) {
        res.status(400).json(err);
    }
};

// Listar eventos por paginado
exports.getEventsPaginated = async (req, res) => {
    const page = parseInt(req.params.page);
    const limit = 5;
    try {
        const events = await Schemas.Event.find({})
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Schemas.Event.countDocuments();
        res.status(200).json({
            events: events,
            actualPage: page,
            totalPages: Math.ceil(count / limit),
            count: events.length
        });
    } catch (err) {
        res.status(400).json(err);
    }
};

// Listar eventos iniciales por orden de fecha
exports.getEventsOrdered = async (req, res) => {
    try {
        const events = await Schemas.Event.aggregate([
            {
                $project: {
                    title: 1,
                    featured: 1,
                    nextDate: {
                        $filter: {
                            input: "$dateList",
                            as: "item",
                            cond: {
                                $and: [
                                    { $gte: ["$$item.date", "$$NOW"] },
                                    { $eq: ["$$item.date", { $min: "$dateList.date" }] }
                                ]
                            }
                        }
                    }
                }
            },
            {
                $match: {
                    "nextDate": {
                        $not: {
                            $size: 0
                        }
                    }
                }
            },
            { $set: { nextDate: { $arrayElemAt: ["$nextDate", 0] } } },
            { $sort: { "nextDate.date": 1 } }
        ]);
        res.status(200).json(events);
    } catch (err) {
        res.status(400).json(err);
    }
};

// Ver eventos destacados

exports.getEventsHighlights = async (req, res) => {
    try {
        // Busco eventos del dia de hoy que sean destacados
        const events = await Schemas.Event.aggregate([{
            $project: {
                title: 1,
                featured: 1,
                nextDate: {
                    $filter: {
                        input: "$dateList",
                        as: "item",
                        cond: { $eq: [{$dateToString: {date: "$$item.date", format: "%Y-%m-%d"}}, {$dateToString: {date: "$$NOW", format: "%Y-%m-%d"}}] }
                    }
                }
            }
        },
        {
            $match: {
                "nextDate": {
                    $not: {
                        $size: 0
                    }
                },
                "featured" : true
            }
        },
        { $set: { nextDate: { $arrayElemAt: ["$nextDate", 0] } } },
        { $sort: { "nextDate.date": 1 } }
    ]);
        res.status(200).json(events);
    } catch (err) {
        res.status(400).json(err);
    }
};


// Compartir evento
exports.shareEvent = async (req, res) => {
    try {
        const event = await Schemas.Event.find({ _id: req.params.id });
        if (event.length === 0) {
            throw {
                message: "Evento no encontrado, no es posible compartir el evento o fue eliminado",
                valueError: req.params.id
            };
        }
        // Simulacion del evento compartido por twitter
        res.status(200).json({
            message: "Evento compartido correctamente",
            url: "http://twitter.com/status/...",
            createdAt: new Date()
        });
    }
    catch (err) {
        res.status(400).json(err);
    }
};

// Agregar un evento con los siguientes atributos:
// title, description, dateList, location, image, highlight
exports.postEvent = async (req, res) => {
    // Valido el token que sea correcto
    const authorization = req.headers.authorization;
    let token = null;
    let decodedToken = null;
    let user = null;
    if (authorization && authorization.toLowerCase().startsWith("bearer")) {
        token = authorization.split(" ")[1];
    }
    try {
        decodedToken = jwt.verify(token, process.env.APP_SECRET);
        if (!token || !decodedToken.userName) {
            throw error = {
                message: "No se encontro un token de autorizacion"
            };
        };
        // Busco el usuario en el token
        user = await User.findOne({ userName: decodedToken.userName });
        if (!user) {
            throw error = {
                message: "No se encontro el usuario en la base de datos"
            };
        };
    } catch (err) {
        res.status(400).json({
            message: "Token inválido o expirado"
        });
        return;
    };
    req.body.user = user
    // Valido que no se encuentren atributos diferentes
    try {
        for (const key in req.body) {
            const found = Object.keys(Schemas.Event.schema.paths).find(k => k === key);
            if (found === undefined) {
                throw {
                    errors: {
                        message: "El evento no puede tener atributos diferentes a los definidos en el modelo.",
                        valueError: key
                    }
                };
            }

        }
        // Valido que en dateList no se encuentren atributos diferentes
        for (const index in req.body.dateList) {
            for (const key in req.body.dateList[index]) {
                const found = Object.keys(Schemas.DateList.schema.paths).find(k => k === key);
                if (found === undefined) {
                    throw {
                        errors: {
                            message: "El array dateList no puede tener atributos diferentes a los definidos en el modelo.",
                            valueError: key
                        }
                    };
                }
            }
        }
        // Las validaciones restantes se realizan en mongoose
        // Se crea el documento y se guarda
        const event = await Schemas.Event.create(req.body);
        // Actualizo el usuario con el evento creado
        await User.findOneAndUpdate({ _id: user._id }, { $push: { events: event } });
        res.status(200).json({
            message: "Evento agregado correctamente"
        });
    } catch (err) {
        console.log(err)
        res.status(400).json(err.errors);
    }
}