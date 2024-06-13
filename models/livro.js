const mongoose = require('mongoose');

const LivroSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true },
    pages: { type: Number, required: true },
    year: { type: Number, required: true },
    price: { type: String, required: true }
});

const Livro = mongoose.model('livro', LivroSchema);

module.exports = Livro;

