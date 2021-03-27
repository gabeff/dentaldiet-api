const express = require('express');
const UserController = require('./controllers/UserController');
const DietaController = require('./controllers/DietaController');
const AlimentoController = require('./controllers/AlimentoController');
const RefeicaoController = require('./controllers/RefeicaoController');
const authorize = require('./_helpers/authorize');
const Role = require('./_helpers/role');

const routes = express.Router();

routes.get('/', (req, res) => {
    return res.status(200).json({ message: 'Api running!' });
});

//checar se token é válido
routes.get('/checkToken',  function (req, res) {
    res.sendStatus(200);
});

//rotas usuario
routes.post('/login', UserController.login);
routes.get('/user',  UserController.findById);
routes.post('/listUsers',  UserController.index);
routes.post('/updateUser',  UserController.update);
routes.post('/updateUserPass',  UserController.updatePassword);
routes.post('/registerUser', UserController.store);

//rotas email
routes.get('/email/confirm/:id', UserController.confirmEmail);

//rotas Dieta
routes.post('/createDieta',  DietaController.store);
routes.post('/updateDieta',  DietaController.update);
routes.get('/listDieta',  DietaController.index);
routes.post('/findDieta',  DietaController.findByDate);
routes.post('/deleteDieta',  DietaController.delete);
routes.get('/Dieta',  DietaController.findById);

//rotas Alimento
routes.post('/createAlimento',  AlimentoController.store);
routes.post('/updateAlimento',  AlimentoController.update);
routes.get('/listAlimento',  AlimentoController.index);
routes.get('/deleteAlimento',  AlimentoController.delete);
routes.get('/Alimento',  AlimentoController.findById);

//rotas Refeições
routes.post('/createRefeicao', RefeicaoController.store);
routes.post('/updateRefeicao', RefeicaoController.update);
routes.get('/listRefeicoes', RefeicaoController.index);
routes.get('/deleteRefeicao', RefeicaoController.delete);
routes.get('/Refeicao', RefeicaoController.findById);

module.exports = routes;