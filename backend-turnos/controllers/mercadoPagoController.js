const axios = require('axios');
require('dotenv').config();

const Turno = require('../models/Turno');
const Medico = require('../models/Medico');
const Especialidad = require('../models/Especialidad');

const mercadoPagoCtrl = {};

mercadoPagoCtrl.generarPago = async (req, res) => {
  try {
    const { idTurno, idMedico, idEspecialidad, obra_social, payer_email } = req.body;

    const descuentosObraSocial = {
      "OSDE": 0.3,
      "Swiss Medical": 0.25,
      "IOSFA": 0.2,
      "Otra": 0.1,
      "Particular": 0
    };

    const turno = await Turno.findById(idTurno);
    const medico = await Medico.findById(idMedico);
    const especialidad = await Especialidad.findById(idEspecialidad);

    if (!turno || !medico || !especialidad) {
      return res.status(400).json({ msg: 'Datos inválidos para el cálculo del pago.' });
    }

    const subtotal = turno.precio_base + medico.precio + especialidad.precio;
    const descuento = descuentosObraSocial[obra_social] || 0;
    const precioFinal = parseFloat((subtotal * (1 - descuento)).toFixed(2));

    const body = {
      payer_email,
      items: [{
        title: `Turno con ${medico.nombre}`,
        description: `Especialidad: ${especialidad.nombre}`,
        quantity: 1,
        unit_price: precioFinal
      }],
      back_urls: {
        success: "http://localhost:4200/pago/exitoso",
        failure: "http://localhost:4200/pago/fallido",
        pending: "http://localhost:4200/pago/pendiente"
      }
    };

    const response = await axios.post('https://api.mercadopago.com/checkout/preferences', body, {
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al generar el pago avanzado' });
  }
};

module.exports = mercadoPagoCtrl;
