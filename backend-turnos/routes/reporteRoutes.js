const express = require('express');
const router = express.Router();
const Turno = require('../models/Turno');
const User = require('../models/User');
const Medico = require('../models/Medico');
const Especialidad = require('../models/Especialidad');
const { verificarRol } = require('../middleware/roles');

// Solo pueden acceder usuarios con rol 'gerente'
router.get('/estadisticas', verificarRol(['gerente']), async (req, res) => {
    try {
        const totalPacientes = await User.countDocuments({ rol: 'paciente' });
        const totalSecretarias = await User.countDocuments({ rol: 'secretaria' });
        const totalTurnos = await Turno.countDocuments();
        const totalMedicos = await Medico.countDocuments();
        const especialidades = await Especialidad.find();

        // Contar cuántos turnos hay por especialidad
        const turnosPorEspecialidad = await Turno.aggregate([
            {
                $group: {
                    _id: '$especialidad', // asumimos que 'Turno' tiene un campo 'especialidad'
                    cantidad: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'especialidads', // nombre de la colección (ojo: pluralización de Mongoose)
                    localField: '_id',
                    foreignField: '_id',
                    as: 'especialidad'
                }
            },
            {
                $unwind: '$especialidad'
            },
            {
                $project: {
                    nombre: '$especialidad.nombre',
                    cantidad: 1
                }
            }
        ]);

        res.json({
            pacientes: totalPacientes,
            secretarias: totalSecretarias,
            medicos: totalMedicos,
            turnos: totalTurnos,
            turnosPorEspecialidad
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
});

// Turnos por médico
router.get('/turnos-por-medico', verificarRol(['gerente']), async (req, res) => {
    try {
        const resultado = await Turno.aggregate([
            {
                $group: {
                    _id: '$medico',
                    cantidad: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'medicos',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'medico'
                }
            },
            { $unwind: '$medico' },
            {
                $lookup: {
                    from: 'especialidads', // ⚠️ Nombre correcto de la colección
                    localField: 'medico.especialidad',
                    foreignField: '_id',
                    as: 'especialidad'
                }
            },
            { $unwind: { path: '$especialidad', preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    nombre: { $concat: ['$medico.nombre', ' ', '$medico.apellido'] },
                    cantidad: 1,
                    especialidad: '$especialidad.nombre'
                }
            },
            { $sort: { cantidad: -1 } }
        ]);

        res.json(resultado);
    } catch (err) {
        console.error('Error al agrupar turnos por médico:', err);
        res.status(500).json({ message: 'Error al obtener datos' });
    }
});

module.exports = router;
