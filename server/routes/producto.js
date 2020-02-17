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

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: body.usuario,
    });

    producto.save( (err, productoDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });

});

// ==============================================================================
// Actualizar el producto
// ==============================================================================
app.put('/productos/:id', (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible
    });

    Producto.findByIdAndUpdate( id, producto, { new: true, runValitators: true }, (err, productoDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ==============================================================================
// Borrar un producto
// ==============================================================================
app.delete('/productos/:id', (req, res) => {

    let id = req.params.id;

    let producto = new Producto({
        disponible: false
    });

    Producto.findByIdAndUpdate( id, producto, { new: true, runValitators: true }, (err, productoDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

module.exports = app;
