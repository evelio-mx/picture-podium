const express = require('express');
const { connectDB } = require('./db'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();


const app = express();  
const PORT = process.env.PORT || 3000;
const http = require('http');

app.get('/', (req, res) => {
  res.send('Hola Mundo!');
});

async function startServer() {
  try {
    // Aquí puedes agregar cualquier lógica de inicialización si es necesario
    await connectDB(); // Conectar a la base de datos antes de iniciar el servidor
    console.log('Servidor inicializado correctamente');
    app.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error al inicializar el servidor:', error);
    process.exit(1); // Salir del proceso con un código de error
  }
}

startServer();




