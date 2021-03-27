const Alimento = require('../models/Alimento');
const mongoose = require('mongoose');

module.exports = {

    async index(req, res) {

        const Alimentos = await Alimento.find().sort('descricao');

        if (Alimentos.length > 0) {
            return res.status(200).json(Alimentos);
        } else {
            return res.status(204).send();
        }
    },

    async findById(req, res) {

        const { Alimento } = req.headers;

        if (mongoose.Types.ObjectId.isValid(Alimento)) {
            const AlimentoExists = await Alimento.findById(Alimento);
            return res.json(AlimentoExists);   
        } else {
            return res.json(null);
        }       
             
    },

    async store(req, res) {

        const { alimento } = req.body;

        const AlimentoExists = await Alimento.findOne({ 
            descricao: alimento.descricao
        });

        if (AlimentoExists) {
            return res.json(AlimentoExists);
        }

        const newAlimento = new Alimento(alimento);
        await newAlimento.save();

        return res.json(newAlimento);
    },

    async update(req, res) {

        const { alimento } = req.body;

        let {descricao, ph, referencia_ph, capacid_tamponica, referencia_ct, 
            alto_teor_acucar, referencia_acucar} = alimento;

        const updatedAlimento = await Alimento.findByIdAndUpdate(alimento._id, { 
            descricao: descricao,
            ph: ph,
            referencia_ph: referencia_ph,
            capacid_tamponica: capacid_tamponica, 
            referencia_ct: referencia_ct, 
            alto_teor_acucar: alto_teor_acucar, 
            referencia_acucar: referencia_acucar
        }, { new: true });
        
        return res.json(updatedAlimento);
    },

    async delete(req, res) {

        const { alimento } = req.headers;

        await Alimento.findByIdAndDelete(alimento, (err, vAlimento) => {
            if (err) {
                return res.json({
                    err
                });
            }

            return res.json({
                vAlimento
            });
        });
    }
};