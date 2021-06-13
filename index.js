const express = require('express');
const route = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
require('dotenv').config({ path: 'variables.env'}); 

//helpers con algunas funciones
const helpers = require('./helpers');

//Crear una conexion a la DB
const db = require('./config/db');

//Importar modelo 
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));

//Crear una app de express
const app = express();

//Definir archivos estaticos
app.use(express.static('public'));

//Habilitar PUG
app.set('view engine','pug'); 

//Habilitar el bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

//Agregamos express Validator a todo el proyecto
//app.use(expressValidator());
 
//Anadir directorio de View
app.set('views', path.join(__dirname, './views'));

//Agregar flash messages
app.use(flash());

app.use(cookieParser());

//Session nos permite navegar sin volver a logear
app.use(session({
    secret: 'topsecret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//Pasar vardump a la app
app.use((req,res,next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();  
    res.locals.usuario = {...req.user} || null;
    
    next();
})

// Route al home
app.use('/', route())

//Servidor y Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El server esta Online!!');
});