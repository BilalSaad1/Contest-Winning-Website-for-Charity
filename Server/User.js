const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    verificationToken: String,
    verificationTokenExpires: Date,
    isEmailVerified: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    isdeactivated: { type: Boolean, default: true },
    isemployeee: {type: Boolean, default: false},
    isclient: {type: Boolean, default: false},
    newsletter: {type: String, enum: ['Yes', 'No'], default: 'Yes'},
    clients: { type: Array, default: [] }
    });

module.exports = mongoose.model('User', userSchema);