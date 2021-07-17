import express from "express";
import { config } from "dotenv";
config();
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { DATA_SOURCE_NAME } from "./data-sources.js";
import { getDataFromFile, renderData } from "./helpers.js";
import {
  imobiliareExtractionJob,
  sendEmail,
  sendImobiliareDataThroughEmail,
} from "./jobs/extraction-job.js";
import { getDataFromSource } from "./data-sources/imobiliare.js";
import { APARTMENT_TEMPLATE, RENT_EMAIL_TEMPLATE } from "./email-templates.js";
const app = express();
const APP_NAME = "Scrap-a-Rent!";
const PORT = process.env.PORT || 14161;

imobiliareExtractionJob();
sendImobiliareDataThroughEmail();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  return res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/data-source/:dataSource", async (req, res) => {
  const dataSource = req.params.dataSource;
  if (dataSource && DATA_SOURCE_NAME.hasOwnProperty(dataSource.toUpperCase())) {
    const fileData = await getDataFromFile(dataSource);
    return res.send(renderData(fileData));
  }
  return res.status(500).json({
    error: `Failed to get data for ${dataSource}!`,
  });
});

app.get("/trigger-extraction", async (req, res) => {
  const { error } = req.query;

  const keys = Object.keys(DATA_SOURCE_NAME);

  res.send(`
    <h1>Trigger Data source extraction<h1>
    <form action="/trigger-extraction" method="POST">
      <label for="dataSource">Data Source</label>
      <select name="dataSource" id="dataSource">
      ${keys.map((key) => {
        return `<option value="${DATA_SOURCE_NAME[key].toLowerCase()}">${
          DATA_SOURCE_NAME[key]
        }</option>`;
      })}
      </select>
      <button type="submit">Submit</button>
    </form>
  `);
});

app.post("/trigger-extraction", async (req, res) => {
  const keys = Object.keys(DATA_SOURCE_NAME);

  const { dataSource } = req.body;
  const createBody = (error) => `
    <h1>Trigger Data source extraction<h1>
    ${error ? "There has been an error!" : "Success. Data gathered!"}
    <form action="/trigger-extraction" method="POST">
      <label for="dataSource">Data Source</label>
      <select name="dataSource" id="dataSource">
      ${keys.map((key) => {
        return `<option value="${DATA_SOURCE_NAME[key].toLowerCase()}">${
          DATA_SOURCE_NAME[key]
        }</option>`;
      })}
      </select>
      <button type="submit">Submit</button>
    </form>
  `;
  try {
    await getDataFromSource(dataSource);
    res.send(createBody(false));
  } catch (e) {
    res.send(createBody(true));
  }
});

app.get("/send-mail", (_req, res) => {
  res.send(`
    <h1>Send data through email</h1>
    <form action="" method="POST">
      <button type="submit">Send Latest data through email</button>
    </form>
  `);
});

app.post("/send-mail", async (_req, res) => {
  const createBody = (message, error) => `
    <h1>Send data through email</h1>
    <p style="color: ${error ? "red" : "green"}">${message}</p>
    <form action="" method="POST">
      <button type="submit">Send Latest data through email</button>
    </form>
  `;
  try {
    sendEmail(RENT_EMAIL_TEMPLATE, DATA_SOURCE_NAME.IMOBILIARE);
    sendEmail(APARTMENT_TEMPLATE, DATA_SOURCE_NAME.IMOBILIARE_APARTAMENT);
    res.send(createBody("Success. The email has been sent!"));
  } catch (e) {
    res.send(createBody("Error. The email could not be sent!"), true);
  }
});

app.listen(PORT, () => {
  console.log(`Started ${APP_NAME} on port ${PORT}`);
});
