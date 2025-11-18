// backend/src/server-simple.ts - Versión ultra simple para probar
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ruta de prueba simple
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '✅ Backend funcionando - Versión simple',
    timestamp: new Date().toISOString()
  });
});

// Ruta de login simple
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'abogado1' && password === '123') {
    res.json({
      message: 'Login exitoso',
      token: 'jwt-token-simple',
      user: { id: 1, username: 'abogado1', nombre: 'Abogado Principal' }
    });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

// Ruta de casos simple
app.get('/api/cases', (req, res) => {
  res.json([
    { id: 1, nombre: 'Caso de prueba', estado: 'PENDIENTE' },
    { id: 2, nombre: 'Otro caso', estado: 'EN_PROCESO' }
  ]);
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor SIMPLE ejecutándose en: http://localhost:${PORT}`);
});