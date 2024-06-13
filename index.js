require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Livro = require('./models/livro');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(mongoURI)
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error(err));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/livros/:page', async (req, res) => {
    try {
        const page = parseInt(req.params.page);
        const skip = (page - 1) * 10;
        const books = await connectAndFindWithPagination(skip);
        res.json(books);
    } catch (error) {
        console.log("deu algum erro: ", error);
        res.status(500).json({ error: "erro no server" });
    }
});

app.get(`/len`, async (req, res) => {
    try {
        const amount = await len();
        res.json(amount);
    } catch (error) {
        console.log("deu algum erro: ", error);
        res.status(500).json({ error: "erro interno" });
    }
});

async function connectAndFindWithPagination(skip) {
    console.log(`Buscando livros com skip: ${skip}`);
    const result = await Livro.find({}).skip(skip).limit(10);
    console.log(`Livros encontrados: ${JSON.stringify(result, null, 2)}`);
    return result;

}

async function len() {
    const result = await Livro.countDocuments();
    return result;
}

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});