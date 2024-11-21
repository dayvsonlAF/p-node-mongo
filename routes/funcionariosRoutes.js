const express = require('express');
const funcionariosController = require('../controllers/funcionariosController');

const router = express.Router();

router.get('/', funcionariosController.get_all_funcionarios);
router.get('/filter/:filter', funcionariosController.get_filtered_funcionarios);
router.post('/add', funcionariosController.post_add_funcionarios);

module.exports = router;