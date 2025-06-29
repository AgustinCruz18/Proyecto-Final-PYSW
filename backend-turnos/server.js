require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const especialidadRoutes = require('./routes/especialidadRoutes');
const medicoRoutes = require('./routes/medicoRoutes');
const horarioRoutes = require('./routes/horarioRoutes');
const turnoRoutes = require('./routes/turnoRoutes');
const iaRoutes = require('./routes/iaRoutes');

require('./config/passport');

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Importa el router de IA
app.use('/api/ia', iaRoutes);
// Importa bien el router
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const fichaRoutes = require('./routes/fichaPacienteRoutes');
app.use('/api/ficha', fichaRoutes);

app.use('/api/especialidades', especialidadRoutes);
app.use('/api/medicos', medicoRoutes);
app.use('/api/horarios', horarioRoutes);
app.use('/api/turnos', turnoRoutes);
// Conexión con MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado');
        app.listen(process.env.PORT, () => {
            console.log(`Servidor en puerto ${process.env.PORT}`);
        });
    })
    .catch(err => console.error('Error al conectar con MongoDB:', err));
