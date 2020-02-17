const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// ==============================================================================
// Obtener todos los productos
// ==============================================================================
app.get('/productos', (req, res) => {

    // trae todos los productos
    // pupulate: usuario categoria
    // paginado

});

// ==============================================================================
// Obtener un producto por ID
// ==============================================================================
app.get('/productos/:id', (req, res) => {

    // pupulate: usuario categoria

});

// ==============================================================================
// Crear un nuevo producto
// ==============================================================================
app.post('/productos', (req, res) => {

    // grabar el usuario
    // grabar una categoria del listado

});

// ==============================================================================
// Actualizar el producto
// ==============================================================================
app.put('/productos/:id', (req, res) => {

    // grabar el usuario
    // grabar una categoria del listado

});

// ==============================================================================
// Borrar un producto
// ==============================================================================
app.delete('/productos/:id', (req, res) => {

    // fisicamente si exite
    // disponible pasa a falso

});

module.exports = app;
