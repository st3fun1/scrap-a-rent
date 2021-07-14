import { fetchFromDataSource } from "./../data-sources.js";
import fs from "fs";
import path from "path";

export const getImobiliareData = async (dataSource) => {
  const data = await fetchFromDataSource(
    dataSource ? dataSource.toUpperCase() : ""
  );

  fs.writeFile(
    path.join(".", "data", `${dataSource.toUpperCase()}.json`),
    JSON.stringify({ data }),
    (err) => {
      if (err) {
        console.error("Couldn't create the data source file");
      }
    }
  );
};
