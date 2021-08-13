// Importo express
const express = require("express")

// Extraer variables de entorno
require("dotenv").config({ path : "variables.env"})

// Conexion a MongoBD
const db = require("./config/db")

// App Express
const app = express()

// bodyParser de express
app.use(express.json())

// Import routes
const eventsRoutes = require("./routes/events")
app.use("/", eventsRoutes())
const usersRoutes = require("./routes/users")
app.use("/", usersRoutes())

// Server y Port
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 9000

// Iniciar el servidor
app.listen(port, host, () => {
    console.log("El servicio esta funcionando correctamente")
})