const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();

// Por convención se usa de la siguiente manera. Aunque se pueden guardar o modificar con get o la petición que sea.

// Obtener lista de usuarios, o un usuario
app.get('/usuario', function (req, res) {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({}, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec( (err, usuarios) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

        });

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
    let body = _.pick(req.body, ['nombre','email','img','role','estado'] );

    Usuario.findByIdAndUpdate( id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

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
