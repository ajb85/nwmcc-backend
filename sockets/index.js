const http = require('api/http.js');
const io = require('socket.io')(http);
const reqDir = require('require-dir');
const listeners = reqDir('./listeners/');

class SocketsManager {
  constructor() {
    this.io = io;

    // Hash of connected users via socket_id:socket
    this.connected = {};

    // Quick lookup for user_id --> socket_id
    this.userToSocket = {};

    console.log('Socket Manager Online');

    this.io.on('connection', socket => {
      this.connected[socket.id] = socket;
      console.log('Client Connected');

      for (let l in listeners) {
        // Turn on default listeners
        socket.on(l, listeners[l].bind(this, socket));
      }

      // Tracks subscriptions to avoid duplicates
      socket.subscriptions = {
        subscribe: true,
        disconnect: true,
        connect: true
      };
    });
  }

  emitToRoom(socket_id, room, context, message) {
    console.log(`EMITTING TO ${room}[${context}]: `);
    this.connected[socket_id].to(room).emit(room, context, message);
  }

  join(userData, room, broadcast) {
    const socket = this._getSocketFromUserData(userData);
    const alreadyJoined = socket.subscriptions[room];

    if (!alreadyJoined) {
      socket.join(room);
      socket.subscriptions[room] = true;

      if (broadcast) {
        // Broadcast message to room of user joining
        this.emitToRoom(socket.id, room, broadcast.context, broadcast.message);
      }
    }

    return !alreadyJoined;
  }

  leave(userData, room, config) {
    const socket = this._getSocketFromUserData(userData);

    console.log(`${socket.user.username} is leaving ${room}`);
    socket.leave(room);

    if (config) {
      this.emitToRoom(socket.id, room, config.context, config.message);
    }
  }

  _getSocketIDFromUserData({ user_id, socket_id }) {
    return user_id ? this.getSocketIDByUserID(user_id) : socket_id;
  }

  _getSocketFromUserData({ user_id, socket_id }) {
    return user_id
      ? this.connected[this.getSocketIDByUserID(user_id)]
      : this.connected[socket_id];
  }
}

module.exports = new SocketsManager();
