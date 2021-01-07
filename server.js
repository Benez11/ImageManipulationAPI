const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api", require("./api/api.router.js"));

const PORTS = {
  MAIN_SERVER: 80,
};

app.listen(PORTS.MAIN_SERVER, () => {
  console.log(`Main server is running on port: ${PORTS.MAIN_SERVER}`);
});
