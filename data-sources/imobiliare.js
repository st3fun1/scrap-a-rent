const { fetchFromDataSource } = require("./../data-sources");
const fs = require("fs");
const path = require("path");
const { createDataFolder } = require("../helpers.js");
const { DATA_DIR } = require("./../constants.js");

const getDataFromSource = async (dataSource) => {
  const data = await fetchFromDataSource(
    dataSource ? dataSource.toUpperCase() : ""
  );

  createDataFolder();

  fs.writeFile(
    path.join(DATA_DIR, `${dataSource.toUpperCase()}.json`),
    JSON.stringify({ data }),
    (err) => {
      if (err) {
        console.error("Couldn't create the data source file");
      }
    }
  );
};

module.exports = {
  getDataFromSource,
};
