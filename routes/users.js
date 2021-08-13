const express = require("express")
const router = express.Router()

// Controllers
const userController = require("../controllers/userController")

module.exports = function() {
    // GET Listar todos los usuarios
    router.get("/users", userController.getUsers)
    // GET Obtener un usuario
    //router.get("/users/:id", userController.getUser)
    // POST Creacion de usuario
    router.post("/users/register", userController.registerUser)
    // POST Login de usuario
    router.post("/users/login", userController.loginUser)
    return router
}