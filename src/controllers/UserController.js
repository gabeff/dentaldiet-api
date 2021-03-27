const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const sendEmail = require('./email.send');
const templates = require('./email.templates');

module.exports = {

    async index(req, res) {

        const users = await User.findById({});

        (users.length > 0) 
            ? res.status(200).json(users)
            : res.status(204).json('Sem dados para mostrar')
    },

    async store(req, res) {

        const { user } = req.body;
        const userRegistration = new User(user);

        userRegistration.save(function (err, newUser) {
            if (err) {
                if (err.code === 11000) { 
                    res.status(500).send("E-mail já cadastrado."); 
                }  else { 
                    res.status(500)
                        .send("Falha no cadastro, favor tentar novamente."); 
                }
            } else {
                sendEmail(newUser.email, templates.confirm(newUser._id, newUser.nome));
                res.status(200).send("Usuário cadastrado com sucesso!");
            }
        });
    },

    async login(req, res) {

        const { email, password } = req.body;

        User.findOne({ email: email }, function (err, user) {
            if (err) {
                console.error(err);
                res.status(500)
                    .json({
                        error: 'Erro interno, favor tentar novamente'
                    });
            } else if (!user) {
                res.status(401)
                    .json({
                        error: 'E-mail ou senha incorretos'
                    });
            } else {
                user.isCorrectPassword(password, function (err, same) {
                    if (err) {
                        console.error(err);
                        res.status(500)
                            .json({
                                error: 'Erro interno, favor tentar novamente'
                            });
                    } else if (!same) {
                        res.status(401)
                            .json({
                                error: 'E-mail ou senha incorretos'
                            });
                    } else {
                        // Issue token
                        const payload = { id: user._id };
                        const token = jwt.sign(payload, process.env.SECRET, {
                            expiresIn: '2d'
                        });
                        // res.cookie('token', token,  
                        //     { 
                        //         httpOnly: true, 
                        //         maxAge: 1000 * 60 * 60 * 24 * 2, 
                        //         sameSite: 'None',
                        //         secure: true
                        //     })
                        res.status(200)
                            .json({ token: token,
                                user: user
                            });
                    }
                });
            }
        });

    },

    async findById(req, res) {

        const { id } = req.headers;

        if (mongoose.Types.ObjectId.isValid(id)) {
            const userExists = await User.findById(id, '-password');
            return res.json(userExists);
        } else {
            return res.json(null);
        }

    },

    //Atualizar usuário
    async update(req, res) {

        const { user } = req.body;

        let { nome, nascimento, altura, peso, atleta } = user;

        const userUpdated = await User.findByIdAndUpdate(user._id, {
            nome: nome,
            nascimento: nascimento,
            altura: altura,
            peso: peso,
            atleta: atleta
        }, { new: true, select: '-password' });

        return res.json(userUpdated);
    },

    //Atualizar usuário
    async confirmEmail(req, res) {

        const { id } = req.params;

        const userUpdated = await User.findByIdAndUpdate(id, {
            confirmed: true
        }, { new: true, select: '-password' });

        if (userUpdated) {
            res.status(200).json({
                message: 'E-mail confirmado, favor prosseguir com login.'
            });
        } else {
            res.status(401).json({
                error: 'E-mail não encontrado, favor realizar novo cadastro.'
            });
        }
    },

    //Atualizar usuário
    async updatePassword(req, res) {

        const { email, password, newpass } = req.body.user;

        User.findOne({ email }, function (err, user) {
            if (err) {
                console.error(err);
                res.status(500)
                    .json({
                        error: 'Erro interno, favor tentar novamente'
                    });
            } else if (!user) {
                res.status(401)
                    .json({
                        error: 'Verifique o e-mail cadastrado'
                    });
            } else {
                user.isCorrectPassword(password, function (err, same) {
                    if (err) {
                        console.error(err);
                        res.status(500)
                            .json({
                                error: 'Erro interno, favor tentar novamente'
                            });
                    } else if (!same) {
                        res.status(401)
                            .json({
                                error: 'Senha atual inválida'
                            });
                    } else {
                        user.password = newpass;
                        user.save();
                        res.status(200).json({
                            message: 'Senha alterada com sucesso'
                        });
                    }
                });
            }
        });
    },

}