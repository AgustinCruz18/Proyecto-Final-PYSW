const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./config/passport');

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// ✅ Importa bien el router
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Conexión con MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado');
        app.listen(process.env.PORT, () => {
            console.log(`Servidor en puerto ${process.env.PORT}`);
        });
    })
    .catch(err => console.error('Error al conectar con MongoDB:', err));
