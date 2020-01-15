const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');

const app = express();

mongoose.connect(
  'mongodb+srv://douglas:douglas@cluster0-kxp2e.mongodb.net/buscadev?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

app.use(express.json());
app.use(routes);

// Running server
app.listen(3333, () => console.log('Server running on port 3333...'));
