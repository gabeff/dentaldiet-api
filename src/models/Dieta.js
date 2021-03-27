const { Schema, model } = require('mongoose');

const DietaSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId, 
        ref: 'User'
    },
    data: {
        type: Date,
        required: true,
    },
    refeicao: {
        type: Schema.Types.ObjectId,
        ref: 'Refeicao',
        required: true,
    },
    alimentos: [{
        type: Schema.Types.ObjectId,
        ref: 'Alimento',
        required: true,
    }],
    phAcido: {
        type: Number,
        required: true,
        default: 0
    },
    acucarAlto: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true,
});

module.exports = model('Dieta', DietaSchema);