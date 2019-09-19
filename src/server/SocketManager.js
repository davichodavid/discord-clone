const io = require('./index').io;

const { VERIFY_USER, USER_CONNECTED, LOGOUT, COMMUNITY_CHAT, USER_DISCONNECTED, MESSAGE_RECEIVED } = require('../Events');
const { createUser, createMessage, createChat } = require('../Factories');

let connectedUsers = {};

module.exports = function (socket) {
  console.log('socket id:' + socket.id);

  let communityChat = createChat();

  let sendMessageToChatfromUser;

  socket.on(VERIFY_USER, (nickname, callback) => {
    if (isUser(connectedUsers, nickname)) {
      callback({ isUser: true, user: null });
    } else {
      callback({ isUser: false, user: createUser({ name: nickname, socketId: socket.id }) });
    }
  });

  socket.on(USER_CONNECTED, user => {
    user.socketId = socket.id;
    connectedUsers = addUser(connectedUsers, user);
    socket.user = user

    sendMessageToChatfromUser = sendMessageToChat(user.name)

    io.emit(USER_CONNECTED, connectedUsers)
    console.log(connectedUsers);

  });

  socket.on('disconnect', () => {
    if ('user' in socket) {
      connectedUsers = removeUser(connectedUsers, socket.user.name);
      io.emit(USER_DISCONNECTED, connectedUsers);
      console.log('Disconnect', connectedUsers);
    }
  })

  socket.on(LOGOUT, () => {
    connectedUsers = removeUser(connectedUsers, socket.user.name)
    io.emit(USER_DISCONNECTED, connectedUsers);
    console.log('Disconnect', connectedUsers);
  })

  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat);
  })

  socket.on(MESSAGE_RECEIVED, ({ chatId, message }) => {
    sendMessageToChatfromUser(chatId, message)
  })

  function sendMessageToChat(sender) {
    return (chatId, message) => {
      io.emit(`${MESSAGE_RECEIVED}-${chatId}`, createMessage({ message, sender }));
    }
  }

  function addUser(userList, user) {
    let newList = Object.assign({}, userList);
    newList[user.name] = user;
    return newList;
  }

  function removeUser(userList, username) {
    let newList = Object.assign({}, userList)
    delete newList[username];
    return newList;
  }

  function isUser(userList, username) {
    return username in userList;
  }

};