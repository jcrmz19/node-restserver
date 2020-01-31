require('./config/config');

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const bodyParser = require('body-parser');

// cada vez que veamos app.use es un MIDDLEWARE, cada que el código para por el app.use se ejecuta ese código del middleware

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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


mongoose.connect(
    'mongodb://localhost:27017/cafe', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) { throw err; }

        console.log('Base de datos ONLINE');
    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});
