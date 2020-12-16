const { writeJson, readJson } = require("fs-extra");
const domain = process.env.MAIL_DOMAIN;
const apiKey = process.env.MAIL_API_KEY;
const mailgun = require("mailgun-js")({
  apiKey: apiKey,
  domain: domain,
});

async function readDB(filepath) {
  try {
    const fileJson = await readJson(filepath);
    return fileJson;
  } catch (error) {
    throw new Error(error);
  }
}
async function writeDB(newDB, filepath) {
  try {
    await writeJson(filepath, newDB);
  } catch (error) {
    throw new Error(error);
  }
}
const err = (msg) => {
  const e = new Error();
  e.message = msg;
  e.httpStatusCode = 404;
  return next(e);
};

function mg(subject = "demo mail", content = "Bello World") {
  return mailgun.messages().send(
    {
      from: `postmaster@${domain}`,
      to: "matson36@gmail.com",
      subject: subject,
      text: content,
    },
    (err, info) => {
      console.log("sent");
      if (err) {
        console.log(`Error: ${err}`);
      } else {
        console.log(`Response: ${info}`);
      }
    }
  );
}
const sortObject = async (obj) =>
  Object.keys(obj)
    .sort()
    .reduce((result, key) => ((result[key] = obj[key]), result), {});

module.exports = { readDB, writeDB, err, mg };
