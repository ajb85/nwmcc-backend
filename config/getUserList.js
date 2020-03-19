module.exports = function getUserList(sockets) {
  const userlist = new Set();
  for (let id in sockets) {
    const s = sockets[id];
    const { user } = s;
    if (user) {
      userlist.add(user.nickname);
    }
  }

  return [...userlist].sort();
};
