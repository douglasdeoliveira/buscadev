import socketio from 'socket.io-client';

const socket = socketio('http://192.168.15.31:3333', {
  autoConnect: false,
});

function connect(latitude, longitude, techs) {
  socket.io.opts.query = {
    latitude,
    longitude,
    techs,
  };

  socket.connect();
}

function disconnect() {
  if (socket.connected) {
    socket.disconnect();
  }
}

function subcribeToNewDevs(subcribeFunction) {
  socket.on('new-dev', subcribeFunction);
}

export { connect, disconnect, subcribeToNewDevs };
