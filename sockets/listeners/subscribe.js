// Allows the frontend to notify the backend of
// events the client needs updates on

module.exports = function(socket, room, broadcast) {
  const didJoin = this.join({ socket_id: socket.id }, room, broadcast);
  if (didJoin) {
    const name = socket && socket.user ? socket.user.nickname : 'New Socket';
    console.log(name, ' SUBSCRIBED TO: ', room);
  }
};
