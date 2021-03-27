const { Schema, model } = require('mongoose');

const RefeicaoSchema = new Schema({
    nome: {
        type: String,
        required: true,
    },
    ordem: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
});

module.exports = model('Refeicao', RefeicaoSchema);