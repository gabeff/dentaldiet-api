const { Schema, model } = require('mongoose');

const AlimentoSchema = new Schema({
    descricao: {
        type: String,
        required: true,
        uppercase: true
    },
    ph: {
        type: Number,
        required: false,
    },
    referencia_ph: {
        type: String,
        required: false,
    },
    capacid_tamponica: {
        type: Number,
        required: false,
    },
    referencia_ct: {
        type: String,
        required: false,
    },
    alto_teor_acucar: {
        type: Boolean,
        required: false,
    },
    referencia_acucar: {
        type: String,
        required: false,
    },
    validado: {
        type: Boolean,
        required: true,
        default: false
    },
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: false
    },
}, {
    timestamps: true,
});

module.exports = model('Alimento', AlimentoSchema);