const { Worker } = require("worker_threads");

const workers = {
  image: null,
};

const startImageWorker = (messageHandler) => {
  const worker = new Worker(
    process.env.globalRootDir + "/common/image.worker.js",
    {
      workerData: require("./constants.json"),
    }
  );
  worker.on(
    "message",
    typeof messageHandler === "function"
      ? (param) => messageHandler(param)
      : (param) =>
          console.log("PARENT: New message from child. Param:", { ...param })
  );
  worker.postMessage({ tag: "init", ping: true });
  worker.on("error", (err) => {
    console.error("An error has occurred. Error details = ", err);
  });
  worker.on("exit", (code) => {
    if (code !== 0) {
      console.info({ exitCode: code });
    } else console.info("Worker has exited successfully.");
    workers.image = null;
  });
  workers.image = worker;
};

const stopImageWorker = () => messageImgWorker({ killCmd: true });

const messageImgWorker = (msg) => {
  if (workers.image) {
    workers.image.postMessage(msg);
    return true;
  }
  return false;
};

module.exports = {
  startImageWorker,
  stopImageWorker,
  messageImgWorker,
};
