module.exports = {
  constants: require("./constants.json"),
  fileSizeHandler: require("./file_size.handler.js"),
  cancelledRequestMonitor: require("./cancelled_request_monitor.js"),
  codeGenerator: require("./code.generator.js"),
  imageHandler: require("./image.handler.js"),
  workerHandler: require("./worker.handler.js"),
  notificationHandler: require("./notification.handler.js"),
};
