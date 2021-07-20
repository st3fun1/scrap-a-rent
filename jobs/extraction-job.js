import nodemailer from "nodemailer";
import cron from "node-cron";
import { getDataFromSource } from "../data-sources/imobiliare.js";
import { getDataFromFile } from "../helpers.js";
import { APARTMENT_TEMPLATE, RENT_EMAIL_TEMPLATE } from "../email-templates.js";
import { DATA_SOURCE_NAME } from "../data-sources.js";

// TODO: application cleanup, use view template engine, use bootstrap for minimal styling, better architecture

const cronValueimobiliareExtractionJob =
  process.env.JOB_EXTRACTION_CRON_VALUE || "59 14 * * *";
const cronValueImobiliareEmailSending =
  process.env.EMAIL_SENDING_CRON_VALUE || "20 15 * * *";

export function imobiliareExtractionJob() {
  cron.schedule(cronValueimobiliareExtractionJob, async () => {
    console.log("Extracting Imobiliare Data....");
    await getDataFromSource(DATA_SOURCE_NAME.IMOBILIARE);
    await getDataFromSource(DATA_SOURCE_NAME.IMOBILIARE_APARTAMENT);
  });
}

export async function sendEmail(template, type) {
  console.log("aaa", process.env.EMAIL_USER, process.env.EMAIL_PASSWORD);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "stefantimosenco23@gmail.com",
      pass: process.env.EMAIL_PASSWORD || "hfaqczzkzfvvhjqb",
    },
  });
  transporter.verify().then(console.log).catch(console.error);
  try {
    const fileData = await getDataFromFile(type);

    transporter.sendMail(
      template(fileData.data, fileData.date),
      function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      }
    );
  } catch (e) {
    console.log("error", e);
  }
}

// vanzare-apartamente

export function sendImobiliareDataThroughEmail() {
  cron.schedule(cronValueImobiliareEmailSending, () => {
    console.log("Sending Imobiliare Data....");
    sendEmail(RENT_EMAIL_TEMPLATE, DATA_SOURCE_NAME.IMOBILIARE);
    sendEmail(APARTMENT_TEMPLATE, DATA_SOURCE_NAME.IMOBILIARE_APARTAMENT);
  });
}
