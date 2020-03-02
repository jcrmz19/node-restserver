const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400)
        .json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo'
            }
        });
    }

    // Validar tipo
    let tiposValidos = ['productos', 'usuarios'];
    if ( tiposValidos.indexOf( tipo ) < 0 ) {
        return res.status(400)
        .json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length -1];

    if ( extensionesValidas.indexOf( extension ) < 0 ) {
        return res.status(400)
        .json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    }

    // Calcular nombre para servidor
    let nombreArchivo = `${ id }-${ Date.now() }.${ extension }`;

    // Copiar archivo al servidor
    archivo.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Si llega aquí, yas e cargo la imagen al servidor, ahora actualizar la base de datos

        if ( tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else if ( tipo === 'productos') {
            imagenProducto(id, res, nombreArchivo);
        }


    });

});

function imagenUsuario( id, res, nombreArchivo ) {

    Usuario.findById( id, (err, usuarioDB) => {

        if (err) {

            borraArchivo( nombreArchivo, 'usuarios' );

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !usuarioDB ) {

            borraArchivo( nombreArchivo, 'usuarios' );

            return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo( usuarioDB.img, 'usuarios' );

        usuarioDB.img = nombreArchivo;

        usuarioDB.save( (err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        });
    });
}

function imagenProducto( id, res, nombreArchivo ) {

    Producto.findById( id, (err, productoDB) => {

        if (err) {

            borraArchivo( nombreArchivo, 'productos' );

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if ( !productoDB ) {

            borraArchivo( nombreArchivo, 'productos' );

            return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        // Borrar la imagen anterior
        borraArchivo( productoDB.img, 'productos' );

        // Actualizar el nombre apuntando a la nueva imagen
        productoDB.img = nombreArchivo;

        productoDB.save( (err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            })
        });
    });
}

function borraArchivo( nombreImagen, tipo ) {

    let pathImagen = path.resolve( __dirname, `../../uploads/${ tipo }/${ nombreImagen }` );

    if ( fs.existsSync(pathImagen) ) {
        fs.unlinkSync( pathImagen );
    }
}

module.exports = app;
