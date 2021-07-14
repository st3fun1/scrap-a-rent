import express from "express";
import { config } from "dotenv";
config();
import { DATA_SOURCE_NAME } from "./data-sources.js";
import { getDataFromFile, renderData } from "./helpers.js";
import {
  imobiliareExtractionJob,
  sendImobiliareDataThroughEmail,
} from "./jobs/extraction-job.js";
import { getImobiliareData } from "./data-sources/imobiliare.js";
const app = express();
const APP_NAME = "Scrap-a-Rent!";
const PORT = process.env.PORT || 14161;

imobiliareExtractionJob();
sendImobiliareDataThroughEmail();

app.get("/", (_req, res) => {
  res.send(`
    <h1>Hello from ${APP_NAME}</h1>
    <a href="/data-source/imobiliare">Go To Imobiliare Data</a>
  `);
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

app.get("/trigger-extraction", async (_req, res) => {
  try {
    await getImobiliareData("imobiliare");
    return res.send(`
      <div>
        <h1>Data succesfully extracted</h1>
        <a href="/data-source/imobiliare">Go To Imobiliare Data</a>
      </div>
    `);
  } catch (e) {
    console.log(e);
    return res.status(500).send("<h1>Error. Could not extract the data!</h1>");
  }
});

app.listen(PORT, () => {
  console.log(`Started ${APP_NAME} on port ${PORT}`);
});
