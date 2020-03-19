// Allows the frontend to notify the backend of
// events the client needs updates on

module.exports = function(socket, room, broadcast) {
  const didJoin = this.join({ socket_id: socket.id }, room, broadcast);
  if (didJoin) {
    const username =
      socket && socket.user ? socket.user.username : 'New Socket';
    console.log(username, ' SUBSCRIBED TO: ', room);
  }
};
