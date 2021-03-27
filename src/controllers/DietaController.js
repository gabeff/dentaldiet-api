const Dieta = require('../models/Dieta');
const mongoose = require('mongoose');

module.exports = {

    //Listar todos os registros de um usuário
    async index(req, res) {

        const { id } = req.headers;

        const Dietas = await Dieta.aggregate([
            { $match: {
                user_id: mongoose.Types.ObjectId(id)
            }},
            { $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$data" } },
                start: {$min: "$data"},
                end: {$max: "$data"},
                totalPHAcido:   { $sum: "$phAcido" },
                totaAcucarAlto: { $sum: "$acucarAlto" }
            }}
        ]);

        return res.json(Dietas);
    },

    //Buscar Dieta pelo id
    async findById(req, res) {

        const { dieta } = req.headers;

        if (mongoose.Types.ObjectId.isValid(dieta)) {
            const DietaExists = await Dieta.findById(dieta);
            return res.json(DietaExists);   
        } else {
            return res.json(null);
        }       
             
    },

    //Buscar Dieta pelo id
    async findByDate(req, res) {

        const { userid, data } = req.body;

        const DietaExists = await Dieta.find({ 
                user_id: userid,
                data: {
                    $gte: new Date(new Date(data).setHours(00, 00, 00)),
                    $lt: new Date(new Date(data).setHours(23, 59, 59))
                }
            }).populate('refeicao')
            .populate('alimentos')
            .sort('refeicao.ordem');

        if (DietaExists) {
            return res.status(200).json(DietaExists);  
        } else {
            return res.status(204).send("Dieta não encontrada");
        }
             
    },

    //Cadastrar Dieta de um usuário
    async store(req, res) {

        const { dieta } = req.body;

        await Dieta.findOneAndDelete({ 
            user_id: dieta.user_id,
            refeicao: dieta.refeicao,
            data: {
                $gte: new Date(new Date(dieta.data).setHours(00, 00, 00)),
                $lt: new Date(new Date(dieta.data).setHours(23, 59, 59))
            },
        });

        let { user_id, data, refeicao, alimentos, detailAlimentos } = dieta;

        const phAcido = detailAlimentos.reduce((a, b) => a + (b.ph < 7 ? 1 : 0), 0);
        const acucarAlto = detailAlimentos.reduce((a, b) => a + (b.alto_teor_acucar ? 1 : 0), 0);

        const newDieta = await Dieta.create({ 
            user_id, 
            data, 
            refeicao, 
            alimentos,
            phAcido,
            acucarAlto
        });

        return res.json(newDieta);
    },

    //Atualizar Dieta de um usuário
    async update(req, res) {

        const { dieta } = req.body;

        let {refeicao, alimentos} = dieta;

        const updatedDieta = await Dieta.findByIdAndUpdate(dieta._id, { 
            refeicao: refeicao,
            alimentos: alimentos
        }, { new: true });
        
        return res.json(updatedDieta);
    },

    //Deletar Dieta de um usuário
    async delete(req, res) {

        const { dieta } = req.body;

        await Dieta.findByIdAndDelete(dieta._id, (err, vDieta) => {
            if (err) {
                return res.json({
                    err
                });
            }

            return res.json({
                vDieta
            });
        });
    }
};