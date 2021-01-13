const constants = process.env.imageManipAPI_constants;
const imageHandler = require("./image.handler.js");

class NotificationManager {
  socketHandler = require("socket.io")(constants.PORTS["SOCKET-IO"], {
    origins: "*:*",
    path: "/socket-io",
  });
  socketPool = {};
  clientPool = {};

  constructor() {
    this.socketHandler.on("connection", (socket) => {
      this.addSocket(socket);
      console.log("a client connected");

      socket.on("associate-client", ({ requestId, uploadId }) => {
        imageHandler.findImage(uploadId, {
          execUponFind: (imageObj) => {
            if (imageObj.reqId === requestId) {
              this.addclient({
                uploadId,
                socketId: socket.id,
              });
              socket.emit("associate-client-reply", {
                status: true,
                body: { message: "Client Associated" },
              });
            }
          },
          execUponNotFound: () => {
            socket.emit("associate-client-reply", {
              status: false,
              body: {
                message:
                  "Client Not Associated. No entry with your parsed uploadId exists",
              },
            });
          },
        });
      });

      socket.on("disconnect", () => {
        console.log("client disconnected");
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

  addClient({ uploadId, socketId }) {
    if (Array.isArray(this.clientPool[uploadId])) {
      this.clientPool[uploadId].push(socketId);
    } else {
      this.clientPool[uploadId] = [socketId];
    }
    return this.clientPool[uploadId];
  }

  removeClient({ uploadId }) {
    return delete this.clientPool[uploadId];
  }

  getClientSockets({ uploadId }) {
    return this.clientPool[uploadId];
  }

  notifyClient({ uploadId, tag, message }) {
    let socketIdArray = this.getClientSockets({ uploadId });
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
