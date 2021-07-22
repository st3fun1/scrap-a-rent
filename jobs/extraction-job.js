const nodemailer = require("nodemailer");
const cron = require("node-cron");
const { getDataFromSource } = require("../data-sources/imobiliare");
const { getDataFromFile, cleanupList } = require("../helpers.js");
const { DATA_SOURCE_NAME } = require("../data-sources");
const { EMAIL_TEMPLATES } = require("../email-templates");
require("dotenv").config();

// TODO: application cleanup, use view template engine, use bootstrap for minimal styling, better architecture

const cronValueimobiliareExtractionJob =
  process.env.JOB_EXTRACTION_CRON_VALUE || "59 14 * * *";
const cronValueImobiliareEmailSending =
  process.env.EMAIL_SENDING_CRON_VALUE || "20 15 * * *";

function imobiliareExtractionJob() {
  cron.schedule(cronValueimobiliareExtractionJob, async () => {
    console.log("Extracting Imobiliare Data....");
    await getDataFromSource(DATA_SOURCE_NAME.IMOBILIARE);
    await getDataFromSource(DATA_SOURCE_NAME.IMOBILIARE_APARTAMENT);
  });
}

async function sendEmail({ templateFunc, dataSource, config }) {
  console.log(
    "SEND MAIL WITH AUTH: ",
    process.env.EMAIL_USER,
    process.env.EMAIL_PASSWORD
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  transporter.verify().then(console.log).catch(console.error);

  try {
    const list = cleanupList((await getDataFromFile(dataSource)).data).slice(
      0,
      10
    );
    if (!templateFunc) {
      throw new Error(
        "A template email function is required for sending an email!"
      );
    }
    transporter.sendMail(await templateFunc(list), (error, info) => {
      if (error) {
        console.error("Error: \n", error);
      }
      if (info) {
        console.log(`Success, email sent for ${dataSource}!`);
      }
    });
  } catch (e) {
    console.log("Error: \n", e);
  }
}

function sendImobiliareDataThroughEmail() {
  cron.schedule(cronValueImobiliareEmailSending, () => {
    console.log("Sending Imobiliare Data....");
    sendEmail({
      templateFunc: EMAIL_TEMPLATES.getRentEmailTemplate,
      dataSource: DATA_SOURCE_NAME.IMOBILIARE,
    });
    sendEmail({
      templateFunc: EMAIL_TEMPLATES.getApartmentsEmailTemplate,
      dataSource: DATA_SOURCE_NAME.IMOBILIARE_APARTAMENT,
    });
  });
}

module.exports = {
  sendImobiliareDataThroughEmail,
  sendEmail,
  imobiliareExtractionJob,
};
