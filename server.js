import express from "express";
import fs from "fs";
import util from "util";
import path from "path";
import { DATA_SOURCE_NAME } from "./data-sources.js";
import { renderData } from "./helpers.js";
import {
  imobiliareExtractionJob,
  sendImobiliareDataThroughEmail,
} from "./jobs/extraction-job.js";
const app = express();
const APP_NAME = "Scrap-a-Rent!";
const PORT = process.env.PORT || 14161;

imobiliareExtractionJob();
sendImobiliareDataThroughEmail();

app.get("/", (_req, res) => {
  res.send(`<h1>Hello from ${APP_NAME}</h1>`);
});

app.get("/data-source/:dataSource", async (req, res) => {
  const dataSource = req.params.dataSource;
  if (dataSource && DATA_SOURCE_NAME.hasOwnProperty(dataSource.toUpperCase())) {
    let fileData = {
      data: [],
      date: "",
    };
    try {
      const filePath = path.join(
        ".",
        "data",
        `${dataSource.toUpperCase()}.json`
      );
      fileData = {
        data: JSON.parse(await util.promisify(fs.readFile)(filePath)).data,
        date: new Date((await util.promisify(fs.stat)(filePath)).birthtime),
      };
    } catch (e) {
      console.error("Could not load the data source file", "\n", e);
    }
    return res.send(renderData(fileData));
  }
  return res.status(500).json({
    error: `Failed to get data for ${dataSource}!`,
  });
});

app.listen(PORT, () => {
  console.log(`Started ${APP_NAME} on port ${PORT}`);
});
