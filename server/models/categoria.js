const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        require: [true, 'El nombre es necesario']
    }
});

categoriaSchema.plugin( uniqueValidator, {
    message: '{PATH} debe de ser único'
});

module.exports = mongoose.model( 'Categoria', categoriaSchema );
