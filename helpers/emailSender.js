const { join } = require("path");
const configPath = join(process.cwd(), "config", ".env");
require("dotenv").config({ path: configPath });
const sg = require("@sendgrid/mail");
const HTTPError = require("./HTTPError");
sg.setApiKey(process.env.SENDGRID_KEY);

const message = {
  to: "",
  from: "dao426474@gmail.com",
  subject: "Verification",
  html: "",
};

const sendEmail = async (data) => {
  const email = { ...data, from: "dao426474@gmail.com" };
  try {
    sg.send(email);
    return true;
  } catch (error) {
    HTTPError(500, "Server error");
  }
};

module.exports = sendEmail;
