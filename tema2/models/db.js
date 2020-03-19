const mongoose = require('mongoose');

const StudentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    registrationNumber: {
        type: String,
        required: true
    },
    bursary: {
        type: Number,
        required: true
    }
}, {
    writeConcern: {
        w: 'majority',
        j: true,
        wtimeout: 1000
    }
});



module.exports = mongoose.model('studs', StudentSchema);