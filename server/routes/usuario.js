const express = require('express');
const bcrypt = require('bcrypt');

const Usuario = require('../models/usuario');

const app = express();

// Por convención se usa de la siguiente manera. Aunque se pueden guardar o modificar con get o la petición que sea.

// Obtener lista de usuarios, o un usuario
app.get('/usuario', function (req, res) {
    res.json('get Usuario LOCAL !!!');
});

// Crear registro
app.post('/usuario', function (req, res) {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10 ),
        role: body.role
    });

    usuario.save( (err, usuarioDB) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

// Actualizar, igualmente usado el patch
app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;
    let body = req.body;

    Usuario.findByIdAndUpdate( id, body, { new: true }, (err, usuarioDB) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

// Borrar, ya no se hace borrado real, sino borrado lógico cambiando estatus para dejarlo no disponible.
app.delete('/usuario', function (req, res) {
    res.json('delete Usuario');
});

module.exports = app;
