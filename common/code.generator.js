const baseDomain =
    "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz025136479",
  capitalLettersDomain = "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  capitalLettersAndNumbersDomain = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  capitalLettersAndSmallLettersDomain =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
(smallLettersDomain = "abcdefghijklmnopqrstuvwxyz"),
  (smallLettersAndNumbersDomain = "abcdefghijklmnopqrstuvwxyz0123456789"),
  (numbersDomain = "0123456789");

const baseLength = 512;

const genetateCode = (len = baseLength, domain = baseDomain) => {
  let generated = "";
  for (var i = 0; i < len; i++) {
    generated += domain.charAt(Math.floor(Math.random() * domain.length));
  }
  return generated;
};

/**
 *
 * @param {*} blocks - e.g { len: 2, domain: "XYZ123,./';" }
 */
const gen = ({ blocks = [], joiner = [""], pastList = [] }) => {
  let generated = "";
  blocks.forEach(
    ({ len = baseLength, domain = baseDomain, toUse = undefined }, index) => {
      domain =
        toUse && toUse === "base"
          ? baseDomain
          : toUse && toUse === "A"
          ? capitalLettersDomain
          : toUse && toUse === "a"
          ? smallLettersDomain
          : toUse && toUse === "Aa"
          ? capitalLettersAndSmallLettersDomain
          : toUse && toUse === "A0"
          ? capitalLettersAndNumbersDomain
          : toUse && toUse === "a0"
          ? smallLettersAndNumbersDomain
          : toUse && toUse === "0"
          ? numbersDomain
          : domain;
      generated +=
        genetateCode(len, domain) + (joiner[index] ? joiner[index] : "");
    }
  );
  // console.log({ generated });
  if (pastList) {
    let foundInPast = pastList.find((code) => code === generated);
    if (foundInPast) return gen({ blocks, joiner, pastList });
    else pastList.push(generated);
  }
  return generated;
};

module.exports = gen;
