class NotificationManager {
  CONSTANTS = {
    port: require("./constants.json")["PORTS"]["SOCKET-IO"],
  };
  socketHandler = require("socket.io")(this.CONSTANTS.port, {
    origins: "*:*",
    path: "/socket-io",
  });
  socketPool = {};
  userPool = {};

  constructor() {
    this.socketHandler.on("connection", (socket) => {
      this.addSocket(socket);
      console.log("a user connected");

      socket.on("associate-client", ({ requestId, uploadId }) => {
        this.addUser({
          uploadId: user.email,
          socketId: socket.id,
        });
        socket.emit("associate-user-reply", {
          status: true,
          body: { message: "User Associated" },
        });
      });

      socket.on("disconnect", () => {
        console.log("user disconnected");
        this.removeSocket(socket);
      });
    });
  }

  addSocket(socket) {
    return (this.socketPool[socket.id] = socket);
  }

  removeSocket(socket) {
    return delete this.socketPool[socket.id];
  }

  addUser({ userEmail, socketId }) {
    if (Array.isArray(this.userPool[userEmail])) {
      this.userPool[userEmail].push(socketId);
    } else {
      this.userPool[userEmail] = [socketId];
    }
    return this.userPool[userEmail];
  }

  removeUser({ userEmail }) {
    return delete this.userPool[userEmail];
  }

  getUserSockets({ userEmail }) {
    return this.userPool[userEmail];
  }

  notifyUser({ userEmail, tag, message }) {
    let socketIdArray = this.getUserSockets({ userEmail });
    if (socketIdArray) {
      this.emitToSockets({ socketIdArray, tag, message });
      return true;
    } else return false;
  }

  emitToSockets({ socketIdArray, tag, message }) {
    socketIdArray.forEach((socketId) => {
      let socket = this.socketPool[socketId];
      if (socket) {
        socket.emit(tag, message);
      }
    });
  }
}

module.exports = new NotificationManager();
