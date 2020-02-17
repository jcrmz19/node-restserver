const express = require('express');
const _ = require('underscore');

const Categoria = require('../models/categoria');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

// ==============================================================================
// Mostrar todas las categorias
// ==============================================================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec( (err, categorias) => {

            if ( err ) {
                return res.status(500).json({
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
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if ( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});

// ==============================================================================
// Crear nueva categoria
// ==============================================================================
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save( (err, categoriaDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
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

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate( id, descCategoria, { new: true, runValitators: true }, (err, categoriaDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
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

    Categoria.findByIdAndRemove( id, (err, categoriaDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoría borrada'
        });

    });
});

module.exports = app;
