// Once a socket disconnects, its info is worthless.
// Destroy it to conserve memory, it'll resub if it
// reconnects.

const getUserList = require('config/getUserList.js');

module.exports = function(socket) {
  console.log('SOCKET DISCONNECTED');
  const user = this.connected[socket.id];

  if (user) {
    const { user_id } = user;
    delete this.userToSocket[user_id];
    delete this.connected[socket.id];
  }

  this.emitToRoom('userlist', getUserList(this.connected));
};
