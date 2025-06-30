const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const especialidadSchema = new Schema({
    nombre: { type: String, required: true, unique: true },
    precio: {type: Number, default: 0}
});

module.exports = mongoose.model('Especialidad', especialidadSchema);
