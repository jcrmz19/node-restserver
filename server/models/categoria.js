const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        require: [true, 'La descripción es necesaria']
    },
    usuario: {
        type: String,
        require: [true, 'El usuario es necesario']
    }
});

categoriaSchema.plugin( uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model( 'Categoria', categoriaSchema );
