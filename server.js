process.env.globalRootDir = __dirname;

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const addRequestId = require("express-request-id")();

let {
  constants,
  fileSizeHandler: { calcBytesBasedOnUnit },
  cancelledRequestMonitor: { addCR },
} = require("./common/index.js");

const app = express();

app.use(addRequestId);
app.use(cors());
app.use(express.json());

app.use(
  fileUpload({
    limits: {
      fileSize: calcBytesBasedOnUnit(
        constants.FILES.MAX_SIZE.VALUE,
        constants.FILES.MAX_SIZE.UNIT
      ),
    },
    useTempFiles: true,
    tempFileDir: "temp/",
    safeFileNames: true,
    abortOnLimit: true,
    limitHandler: (req, res) => {
      let added = addCR(req.id);
      if (added)
        res.status(413).json({
          status: false,
          body: {
            message: `File size limit (${constants.FILES.MAX_SIZE.VALUE} ${constants.FILES.MAX_SIZE.UNIT}) has been reached. Operation cancelled.`,
          },
        });
      else
        console.error("\nThis request has been responded to! ReqID: ", req.id);
    },
  })
);

// app.use("/api", require("./api/api.router.js"));
app.use("/upload", require("./api/routes/index").upload.router);
app.use("/export", require("./api/routes/index").export.router);

const startServer = () => {
  app.listen(constants.PORTS.MAIN_SERVER, () => {
    console.log(
      `Main server is running on port: ${constants.PORTS.MAIN_SERVER}`
    );
  });
};

module.exports = startServer;
