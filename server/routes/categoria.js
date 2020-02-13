const express = require('express');
const _ = require('underscore');

const Categoria = require('../models/categoria');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');


const app = express();

// ==============================================================================
// Mostrar todas las categorias
// ==============================================================================
app.get('/categoria', (req, res) => {

    Categoria.find({}, 'nombre')
        .exec( (err, categorias) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments({}, (err, conteo) => {

                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                   ok: true,
                   categorias,
                   cuantas: conteo
                });
            });
        });
});

// ==============================================================================
// Mostrar una categoría por ID
// ==============================================================================
app.get('/categoria/:id', (req, res) => {

    const id = req.params.id;

    Categoria.find({_id: id}, 'nombre')
        .exec( (err, categoria) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria
            });

        });
});

// ==============================================================================
// Crear nueva categoria
// ==============================================================================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombre
    });

    categoria.save( (err, categoriaDB) => {
        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ==============================================================================
// Actualizar categoria
// ==============================================================================
app.put('/categoria/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    let body = _.pick(req.body, ['nombre'] );

    Categoria.findByIdAndUpdate( id, body, { new: true, runValitators: true }, (err, categoriaDB) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ==============================================================================
// Borrado de categoria
// ==============================================================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    const id = req.params.id;

    Categoria.findByIdAndRemove( id, (err, categoriaBorrada) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !categoriaBorrada ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });

    });
});

module.exports = app;
