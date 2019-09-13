const io = require('./index').io;

module.exports = function(socket) {
  console.log('socket id:' + socket.id);
};
