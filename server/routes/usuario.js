const express = require('express');

const app = express();

// Por convención se usa de la siguiente manera. Aunque se pueden guardar o modificar con get o la petición que sea.

// Obtener lista de usuarios, o un usuario
app.get('/usuario', function (req, res) {
    res.json('get Usuario');
});

// Crear registro
app.post('/usuario', function (req, res) {

    let body = req.body;

    if ( body.nombre === undefined ) {

        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });

    } else {
        res.json({
            persona: body
        });
    }


});

// Actualizar, igualmente usado el patch
app.put('/usuario/:id', function (req, res) {

    let id = req.params.id;

    res.json({
        id
    });
});

// Borrar, ya no se hace borrado real, sino borrado lógico cambiando estatus para dejarlo no disponible.
app.delete('/usuario', function (req, res) {
    res.json('delete Usuario');
});

module.exports = app;