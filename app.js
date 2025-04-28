// app.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Importar las rutas de artículos
const rutaArticulos = require('./routes/articulos'); // Cambié el nombre de 've' a 'articulos'

// Iniciar la App
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar "middleware"
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuración de rutas
app.use('/', rutaArticulos); // Usar las rutas de artículos

// Servidor Web
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:3000`);
});
