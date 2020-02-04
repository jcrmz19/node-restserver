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

const uri = "mongodb+srv://cafe:cafe@cluster0-csu9d.mongodb.net/cafe?retryWrites=true&w=majority";

mongoose.connect(
    uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    },
    (err) => {
        if (err) { throw err; }

        console.log('Base de datos ONLINE');
    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});
