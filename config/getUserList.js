module.exports = function getUserList(sockets) {
  const userlist = [];
  for (let id in sockets) {
    const s = sockets[id];
    const { user } = s;
    userlist.push(user.nickname);
  }

  return userlist.sort();
};
