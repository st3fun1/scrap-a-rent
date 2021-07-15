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

export async function sendEmail() {
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
    const fileData = await getDataFromFile("imobiliare");
    const mailOptions = {
      from: "admin@scrap-a-rent.com",
      to: "stefantimosenco@gmail.com, danielaandries26@gmail.com",
      subject: "Imobiliare Data",
      html: `Salut, 
      <p>Salut,\n
      mai jos vei gasi ultimile garsoniere colectate:<p>
      ${renderData({
        data: fileData.data.slice(0, 10),
        date: fileData.date,
      })}
      <p>Pentru a vedea o lista completa click <a href="/data-source/imobiliare">aici</a></p>
      `,
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

// vanzare-apartamente

export function sendImobiliareDataThroughEmail() {
  cron.schedule(cronValueImobiliareEmailSending, () => {
    console.log("Sending Imobiliare Data....");
    sendEmail();
  });
}
