const mongoose = require('mongoose');
const validator = require("validator");
const Schema = mongoose.Schema;

// Schema para el array dateList
const dateListSchema = new Schema({
    date: {
        type: Date,
        required: [true, "la fecha es requerida"]
    },
    price: {
        type: Number,
        required: [true, "el precio es requerida"]
    }
});

// Schema para event
const eventSchema = new Schema({
    title: {
        type: String,
        required: [true, "el titulo es requerido"],
        minLength: [5, "El titulo debe superar los 5 caracteres"],
        maxLength: [50, "El titulo no puede superar los 50 caracteres"]
    },
    description: {
        type: String,
        required: [true, "la descripcion es requerido"],
        minLength: [5, "La descripcion debe superar los 5 caracteres"],
        maxLength: [500, "La descripcion no puede superar los 500 caracteres"]
    },
    dateList: {
        type: [dateListSchema],
        required: [true, "dateList es requerido"],
        validate: {
            validator: value => value.length > 0,
            message: "Debe haber al menos una fecha y precio ingresada en dateList"
        }
    },
    location: {
        type: String,
        required: [true, "location es requerido"]
    },
    image: {
        type: String,
        required: [true, "la URL de la imagen es requerida"],
        validate: {
            validator: value => validator.isURL(value, { protocols: ["http", "https", "ftp"], require_tld: true, require_protocol: true }),
            message: "La URL de la imagen debe ser valida"
        }
    },
    featured: {
        type: Boolean,
        required: [true, "featured es requerido"]
    },
    user : {
        type : Schema.ObjectId,
        ref : 'User',
        required : [true, "El usuario es requerido"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Event = mongoose.model('Event', eventSchema);
const DateList = mongoose.model("dateList", dateListSchema);

module.exports = {Event, DateList};