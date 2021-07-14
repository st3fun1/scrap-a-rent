import nodemailer from "nodemailer";
import cron from "node-cron";
import fs from "fs";
import path from "path";
import { fetchFromDataSource } from "./../data-sources.js";
import { getImobiliareData } from "../data-sources/imobiliare.js";

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

export function sendImobiliareDataThroughEmail() {
  cron.schedule(cronValueImobiliareEmailSending, () => {
    console.log("Sending Imobiliare Data....");
  });
}
