const express = require('express');


const app = express();  
const PORT = process.env.PORT || 3000;
const http = require('http');

app.get('/', (req, res) => {
  res.send('Hola Mundo!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

