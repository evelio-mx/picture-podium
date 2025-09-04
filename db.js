const {Client} = require('pg');
require('dotenv').config(); // Cargar variables de entorno desde .env

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function connectDB() {
  try {
    await client.connect();
    console.log('Conectado a la base de datos PostgreSQL');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  } 
}

module.exports = { client, connectDB };
