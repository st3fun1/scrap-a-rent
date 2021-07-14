import express from "express";
import { fetchFromDataSource } from "./data-sources.js";
const app = express();
const APP_NAME = "Scrap-a-Rent!";
const PORT = process.env.PORT || 14161;

app.get("/", (_req, res) => {
  res.send(`Hello from ${APP_NAME}`);
});

app.get("/data-source/:dataSource", async (req, res) => {
  const dataSource = req.params.dataSource;

  try {
    const data = await fetchFromDataSource(
      dataSource ? dataSource.toUpperCase() : ""
    );
    return res.send(`
      <div class="container">
      ${data
        .map((item) => {
          return `
          <div class="item">
            <h2>${item.title}</h2>
            <div>Agentie: ${item.agency}</div>
            <div>Localization: ${item.localization}</div>
            <div>Caracteristici: ${item.characteristics}</div>
            <div>Pret: ${item.price}</div>
            <a target="_blank" href="${item.link}">Link</a>
            <div>${item.description.reduce(
              (prev, current) => prev + "\n" + `<p>${current}</p>`,
              ""
            )}</div>
          </div>
        `;
        })
        .reduce((prev, current) => prev + "\n" + current, "")}
      </div>`);
  } catch (e) {
    console.log("Error", e);
    return res.status(500).json({
      error: `Failed to get data for ${dataSource}!`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Started ${APP_NAME} on port ${PORT}`);
});
