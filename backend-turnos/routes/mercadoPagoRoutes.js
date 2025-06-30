const express = require('express');
const router = express.Router();
const mpCtrl = require('../controllers/mercadoPagoController');

router.post('/pago', mpCtrl.generarPago);

module.exports = router;
