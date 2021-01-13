// ***Cancelled Request (CR)***
const { REQUEST_MONITOR } = process.env.imageManipAPI_constants;

const CRs = [];

const findCR = function (reqId) {
  return CRs.filter((reqObj) => reqObj.id === reqId);
};

const addCR = function (reqId) {
  let foundCRs = findCR(reqId);
  if (foundCRs.length === 0) {
    console.info("\nAdding CR:", reqId);
    CRs.push({ id: reqId, time: Date.now() });
    timer === null ? startTimer() : "";
    return true;
  } else return false;
};

const removeCR = function (idx) {
  CRs.splice(idx, 1);
};

let timer = null;

const startTimer = function () {
  console.info("\nLoop STARTED!");
  timer = setInterval(() => {
    let toBeSpliced = [];
    CRs.forEach((reqObj, idx) => {
      if (Date.now() - reqObj.time >= REQUEST_MONITOR.LOOP_INTERVAL)
        toBeSpliced.push(idx);
    });
    while (toBeSpliced.length > 0) {
      let CR = toBeSpliced.pop();
      console.info("\nRemoving CR: ", CR, "Time: ", Date.now());
      removeCR(CR);
    }
    if (CRs.length === 0) {
      console.info("\nLoop STOPPED!");
      clearInterval(timer);
      timer = null;
    }
  }, REQUEST_MONITOR.LOOP_INTERVAL);
};

module.exports = {
  CRs,
  findCR,
  addCR,
  removeCR,
  timer,
  startTimer,
};
