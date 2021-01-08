const sizeHandler = {
  gbToBytes: function (gb) {
    return gb * 1024 * 1024 * 1024;
  },
  mbToBytes: function (mb) {
    return mb * 1024 * 1024;
  },
  kbToBytes: function (kb) {
    return kb * 1024;
  },
};

const calcBytesBasedOnUnit = function (value, unit) {
  return unit === "B"
    ? value
    : unit === "KB"
    ? sizeHandler.kbToBytes(value)
    : unit === "MB"
    ? sizeHandler.mbToBytes(value)
    : unit === "GB"
    ? sizeHandler.gbToBytes(value)
    : -1;
};

module.exports = { sizeHandler, calcBytesBasedOnUnit };
