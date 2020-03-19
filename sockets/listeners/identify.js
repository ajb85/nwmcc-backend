// Allows clients to broadcast their identity so the app can
// tie socket clients and users together.

// For security reasons, users are identified by their jwt tokens

const jwt = require('jsonwebtoken');
const secret = require('config/secret.js');

module.exports = function(socket, token) {
  if (!this.connected[socket.id].user && token) {
    jwt.verify(token, secret, (err, decodedToken) => {
      if (!err) {
        const { id, nickname, email } = decodedToken;
        this.connected[socket.id].user = { id, nickname, email };
        console.log(
          'IDENTIFIED SOCKET: ',
          this.connected[socket.id].user.nickname
        );
        this.emitToRoom('userlist', getUserList(this.connected));
        this.userToSocket[id] = socket.id;
      }
    });
  }
};

function getUserList(sockets) {
  const userlist = [];
  for (let id in sockets) {
    const s = sockets[id];
    const { user } = s;
    userlist.push(user.nickname);
  }

  return userlist.sort();
}
