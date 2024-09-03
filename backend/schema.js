const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uploadSchema = new Schema({
    email: String,
    category: String,
    item: String,
    price: Number,
    quantity: Number,
    description: String
});

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    selectedType: {
        type: String,
        // required: true
    }
}, {timestamps: true});

const User = mongoose.model('user', userSchema);
const Upload = mongoose.model('stock', uploadSchema);
module.exports = { User, Upload };