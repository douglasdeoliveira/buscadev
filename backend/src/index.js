const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket');

const app = express();
const server = http.Server(app);

// Setup WebSocket
setupWebsocket(server);

mongoose.connect(
  'mongodb+srv://douglas:douglas@cluster0-kxp2e.mongodb.net/buscadev?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  }
);

app.use(cors());
app.use(express.json());
app.use(routes);

// Running server
server.listen(3333, () => console.log('Server running on port 3333...'));
