import { fetchFromDataSource } from "./../data-sources.js";
import fs from "fs";
import path from "path";
import { createDataFolder } from "../helpers.js";
import { DATA_DIR } from "./../constants.js";

export const getDataFromSource = async (dataSource) => {
  const data = await fetchFromDataSource(
    dataSource ? dataSource.toUpperCase() : ""
  );

  createDataFolder();

  fs.writeFile(
    path.join(DATA_DIR, `${dataSource.toUpperCase()}.json`),
    JSON.stringify({ data }),
    (err) => {
      if (err) {
        console.log("error", err);
        console.error("Couldn't create the data source file");
      }
    }
  );
};
