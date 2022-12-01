const express = require('express') // Módulo express
const { engine } = require('express-handlebars')
const mysql = require('mysql')
const myconn = require('express-myconnection')
const cors = require('cors')
const session = require('express-session')
const bodyParser = require('body-parser')
const routes = require('../routes') // Archivo local: routes.js

const loginRutas = require('./routes/login');

require('dotenv').config()

const app = express()
app.set('port', process.env.PORT || 9000)
const dbOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.PASSWORD,
    database: 'punto_venta'
}

// Vistas
app.set('views', __dirname + '/vistas');
app.engine('.hbs', engine({
    extname: '.hbs',
}));
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Middlewares (ni idea de qué es esto)
app.use(myconn(mysql, dbOptions, 'single'))
app.use(express.json())
app.use(cors())

// Rutas ***********************************************************************
// app.get('/', (req, res)=> {
//     res.send('Bienvenido a mi proyecto')
// })

app.use('/api', routes)

// Correr el servidor **********************************************************
// Soporta hot-reloading, por lo que los cambios se verán en tiempo de ejecución
// cmd: npm run start
// mysql shell: \c root@localhost:3306

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

app.listen(app.get('port'), ()=> {
    console.log('Servidor corriendo en el puerto: ', app.get('port'))
}) 

app.use('/', loginRutas);

app.get('/', (req, res) => {
    if(req.session.loggedin == true) {
        // res.render('login/registrar');
        res.render('home', { name: req.session.name });
    } else {
        // res.redirect('/');
        res.redirect('/login');
    }
    // res.render('home')
})