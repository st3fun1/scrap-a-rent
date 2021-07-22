const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");
const util = require("util");
const ejs = require("ejs");
const { DATA_DIR } = require("./constants");

let envCredentials;

try {
  envCredentials = process.env.BASIC_AUTH_CREDENTIALS.split(":");
} catch (e) {
  throw new Error("Basic auth credentials are required");
}

const fetchPageHTML = async (url) => {
  return await fetch(url)
    .then((res) => res.text())
    .then((html) => html);
};

const getHTMLListOfData = async ({ list, targetPeople, dataSource }) =>
  await ejs.renderFile(__dirname + "/views/emails/apartments.ejs", {
    list,
    targetPeople,
    dataSource,
    linkToMore: `${process.env.HOST_NAME}/data-source/${dataSource}`,
  });

const getDataFromFile = async (dataSource) => {
  let fileData = {
    data: [],
    date: "",
  };
  try {
    const filePath = path.join(".", "data", `${dataSource.toUpperCase()}.json`);
    fileData = {
      data: JSON.parse(await util.promisify(fs.readFile)(filePath)).data,
      date: new Date((await util.promisify(fs.stat)(filePath)).birthtime),
    };
  } catch (e) {
    console.log("Could not get data from file", e);
  }

  return fileData;
};

const createDataFolder = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
  }
};

function triggerBasicAuth(req, res, next) {
  if (/data\-source/.test(req.path)) {
    return next();
  }
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Basic ") === -1
  ) {
    const realm = "Basic Authentication";
    res.writeHead(401, { "WWW-Authenticate": 'Basic realm="' + realm + '"' });
    return res.end("Authorization is needed");
  }
  next();
}

async function basicAuth(req, res, next) {
  // TODO: create a route for auth
  // if (req.path === "/users/authenticate") {
  //   return next();
  // }

  // check for basic auth header
  if (/data\-source/.test(req.path)) {
    return next();
  }
  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf("Basic ") === -1
  ) {
    return res.status(401).json({ message: "Missing Authorization Header" });
  }

  // verify auth credentials
  const base64Credentials = req.headers.authorization.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");
  const isValid =
    username === envCredentials[0] && password === envCredentials[1];
  if (!isValid) {
    return res
      .status(401)
      .json({ message: "Invalid Authentication Credentials" });
  }
  next();
}

const cleanupList = (list, maxPrice) => {
  return list
    .filter((item) => {
      return (
        (item.price && maxPrice && parseInt(item.price) < parseInt(maxPrice)) ||
        (item.price && !maxPrice)
      );
    })
    .sort((a, b) => (parseInt(a.price) > parseInt(b.price) ? 1 : -1));
};

module.exports = {
  createDataFolder,
  getDataFromFile,
  getHTMLListOfData,
  fetchPageHTML,
  basicAuth,
  cleanupList,
  triggerBasicAuth,
};
