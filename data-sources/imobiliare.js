import { fetchFromDataSource } from "./../data-sources.js";
import fs from "fs";
import path from "path";

const dir = "../data";
export const getImobiliareData = async (dataSource) => {
  const data = await fetchFromDataSource(
    dataSource ? dataSource.toUpperCase() : ""
  );

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFile(
    path.join(".", dir, `${dataSource.toUpperCase()}.json`),
    JSON.stringify({ data }),
    (err) => {
      if (err) {
        console.error("Couldn't create the data source file");
      }
    }
  );
};
