import nodemailer from "nodemailer";
import cron from "node-cron";
import { getImobiliareData } from "../data-sources/imobiliare.js";
import { getDataFromFile, renderData } from "../helpers.js";

// TODO: application cleanup, use view template engine, use bootstrap for minimal styling, better architecture

const cronValueimobiliareExtractionJob =
  process.env.JOB_EXTRACTION_CRON_VALUE || "59 14 * * *";
const cronValueImobiliareEmailSending =
  process.env.EMAIL_SENDING_CRON_VALUE || "20 15 * * *";

export function imobiliareExtractionJob() {
  cron.schedule(cronValueimobiliareExtractionJob, async () => {
    console.log("Extracting Imobiliare Data....");
    await getImobiliareData("imobiliare");
  });
}

async function sendEmail() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  transporter.verify().then(console.log).catch(console.error);
  try {
    const fileData = await getDataFromFile("imobiliare");
    const mailOptions = {
      from: "admin@scrap-a-rent.com",
      to: "stefantimosenco@gmail.com, danielaandries26@gmail.com",
      subject: "Imobiliare Data",
      html: renderData({
        data: fileData.data.slice(0, 4),
        date: fileData.date,
      }),
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  } catch (e) {
    console.log("error", e);
  }
}

export function sendImobiliareDataThroughEmail() {
  cron.schedule(cronValueImobiliareEmailSending, () => {
    console.log("Sending Imobiliare Data....");
    sendEmail();
  });
}
