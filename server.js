const express = require('express');
const { connectDB } = require('./db'); // Asegúrate de que la ruta sea correcta
require('dotenv').config();
const AWS = require('aws-sdk');
const multer = require('multer');


const app = express();  
const PORT = process.env.PORT || 3000;
app.use(express.json()); // Permite al servidor entender JSON


// --- Configuración de Almacenamiento (MinIO) ---
const s3 = new AWS.S3({
    endpoint: process.env.MINIO_ENDPOINT,
    accessKeyId: process.env.MINIO_ACCESS_KEY,
    secretAccessKey: process.env.MINIO_SECRET_KEY,
    s3ForcePathStyle: true, // Necesario para MinIO
    signatureVersion: 'v4'
});

//Endopoint
app.get('/', (req, res) => {
  res.send('Hola Mundo!');
});

// POST /upload - Sube una nueva imagen
app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se ha subido ningún archivo.');
    }

    const file = req.file;
    const fileName = `${Date.now()}_${file.originalname}`;
    const bucketName = process.env.MINIO_BUCKET_NAME;

    const params = {
        Bucket: bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read' // Hace el archivo públicamente accesible
    };

    try {
        // Subir a MinIO
        await s3.upload(params).promise();

        // Generar la URL pública
        const imageUrl = `${process.env.MINIO_ENDPOINT}/${bucketName}/${fileName}`;

        // Guardar en PostgreSQL
        const result = await pool.query(
            'INSERT INTO posts (image_url) VALUES ($1) RETURNING *',
            [imageUrl]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al subir la imagen:', error);
        res.status(500).send('Error en el servidor.');
    }
});

// GET /posts - Obtiene todas las publicaciones ordenadas por likes
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts ORDER BY likes DESC');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
        res.status(500).send('Error en el servidor.');
    }
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




