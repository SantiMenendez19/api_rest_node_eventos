const express = require("express")
const router = express.Router()

// Controllers
const eventController = require("../controllers/eventController")

module.exports = function() {
    // GET Listar todos los eventos
    router.get("/events", eventController.getEvents)
    // GET Listar todos los eventos por pagina
    router.get("/events/page/:page", eventController.getEventsPaginated)
    // GET Listar los eventos iniciales ordenados por fecha
    router.get("/events/ordered", eventController.getEventsOrdered)
    // GET Listar los eventos destacados del dia
    router.get("/events/highlights", eventController.getEventsHighlights)
    // GET Evento por id (detalle)
    router.get("/events/:id", eventController.getEventId)
    // POST Compartir evento (id)
    router.post("/events/:id/share", eventController.shareEvent)
    // POST Crear evento
    router.post("/events", eventController.postEvent)
    return router
}