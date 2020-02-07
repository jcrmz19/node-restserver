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

app.use( require('./routes/usuario') );

const uri = "mongodb+srv://cor:xbUtPpuPmIseVUGT@cluster0-jols1.mongodb.net/cafe?retryWrites=true&w=majority";

mongoose.connect(
    uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    },
    (err) => {
        if (err) { throw err; }

        console.log('Base de datos ONLINE');
    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});
