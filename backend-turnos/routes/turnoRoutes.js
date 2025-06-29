const express = require('express');
const router = express.Router();
const controller = require('../controllers/turnoController');
const { verificarRol } = require('../middleware/roles');

router.get('/', controller.obtenerTodos);
router.post('/', verificarRol(['secretaria']), controller.crear);
router.get('/medico/:id', controller.obtenerDisponiblesPorMedico);
router.put('/reservar/:id', verificarRol(['paciente']), controller.reservar);
router.put('/:id', verificarRol(['secretaria']), controller.actualizar);
router.delete('/:id', verificarRol(['secretaria']), controller.eliminar);

module.exports = router;
