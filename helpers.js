import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import util from "util";
import { DATA_DIR } from "./constants.js";

export const fetchPageHTML = async (url) => {
  return await fetch(url)
    .then((res) => res.text())
    .then((html) => html);
};

export const renderData = ({ data, date }) => `
<div class="container">
<h1>Apartments as of date: ${date}</h1>
${data
  .sort((a, b) => {
    return parseInt(a.price) > parseInt(b.price) ? 1 : -1;
  })
  .map((item) => {
    return `

    <div class="item">
      <h2>${item.title}</h2>
      <div>Agentie: ${item.agency}</div>
      <div>Localization: ${
        item.localization ? item.localization.trim() : ""
      }</div>
      <div>Caracteristici: ${
        item.characteristics ? item.characteristics.trim() : ""
      }</div>
      <div>Pret: ${item.price}</div>
      <a target="_blank" href="${item.link}">Link</a>
      <div>${
        item.description
          ? item.description.reduce(
              (prev, current) => prev + "\n" + `<p>${current}</p>`,
              ""
            )
          : ""
      }</div>
    </div>
  `;
  })
  .reduce((prev, current) => prev + "\n" + current, "")}
</div>`;

export const getDataFromFile = async (dataSource) => {
  let fileData = {
    data: [],
    date: "",
  };
  try {
    const filePath = path.join(".", "data", `${dataSource.toUpperCase()}.json`);
    console.log(JSON.parse(await util.promisify(fs.readFile)(filePath)));
    fileData = {
      data: JSON.parse(await util.promisify(fs.readFile)(filePath)).data,
      date: new Date((await util.promisify(fs.stat)(filePath)).birthtime),
    };
  } catch (e) {
    console.log("Could not get data from file", e);
  }

  return fileData;
};

export const createDataFolder = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }
};
