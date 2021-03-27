const Refeicao = require('../models/Refeicao');
const mongoose = require('mongoose');

module.exports = {

    //Listar todas as refeições cadastradas
    async index(req, res) {

        Refeicao.find().sort('ordem')
        .exec(function(err, refeicoes) {
            if (err) {
                console.error(err);
                res.status(500)
                    .json({
                        error: 'Erro interno, favor tentar novamente'
                    });
            } else {
                return res.status(200).json(refeicoes);
            }
        });
    },

    //Buscar refeicoes pelo id
    async findById(req, res) {

        const { id } = req.headers;

        if (mongoose.Types.ObjectId.isValid(id)) {
            const RefeicaoExists = await Refeicao.findById(id);
            return res.json(RefeicaoExists);   
        } else {
            return res.json(null);
        }       
             
    },

    //Cadastrar Refeicao
    async store(req, res) {

        const { Refeicao } = req.body;

        const RefeicaoExists = await Refeicao.findOne({ 
            nome: Refeicao.nome
        });

        if (RefeicaoExists) {
            return res.json(RefeicaoExists);
        }

        const cRefeicao = await Refeicao.create({ 
          nome: Refeicao.nome
        });

        return res.json(cRefeicao);
    },

    //Atualizar Refeicao
    async update(req, res) {

        const { Refeicao } = req.body;

        const cRefeicao = await Refeicao.findByIdAndUpdate(Refeicao._id, { 
            nome: Refeicao.nome,
        }, { new: true });
        
        return res.json(cRefeicao);
    },

    //Deletar Refeicao
    async delete(req, res) {

        const { id } = req.headers;

        await Refeicao.findByIdAndDelete(id, (err, vRefeicao) => {
            if (err) {
                return res.json({
                    err
                });
            }

            return res.json({
                vRefeicao
            });
        });
    }
};