const mongoose = require('mongoose');
const validator = require("validator");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

// Schema para user
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    events : [{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;