// src/routes/feedback.js
const express = require('express');
// Importa todo el objeto y luego usa sus propiedades — así evitas problemas de path o renombrado.
const feedbackController = require('../controllers/feedbackController');

const router = express.Router();

// POST /feedback → feedbackController.createFeedback
router.post('/', feedbackController.createFeedback);

// GET  /feedback → feedbackController.getAllFeedback
router.get('/', feedbackController.getAllFeedback);

module.exports = router;
