const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Register',
        required:true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    warranty: {
        type: String,
        required: false
    },
    manufacturer: {
        type: String,
        required: false
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    weight: {
        type: String,
        required: false
    },
    color: {
        type: String,
        required: false
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
