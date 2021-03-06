const express = require("express");
const bodyParser = require("body-parser");
const { config } = require("dotenv");
config();
const { DATA_SOURCE_NAME } = require("./data-sources");
const {
  getDataFromFile,
  basicAuth,
  triggerBasicAuth,
  cleanupList,
} = require("./helpers");
const {
  imobiliareExtractionJob,
  sendEmail,
  sendImobiliareDataThroughEmail,
} = require("./jobs/extraction-job");
const { getDataFromSource } = require("./data-sources/imobiliare");
const { EMAIL_TEMPLATES } = require("./email-templates");
const app = express();
const APP_NAME = "Scrap-a-Rent!";
const PORT = process.env.PORT || 14161;

imobiliareExtractionJob();
sendImobiliareDataThroughEmail();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(express.static("public"));

// use basic HTTP auth to secure the api
app.use(triggerBasicAuth);
app.use(basicAuth);

app.get("/", (_req, res) => {
  return res.render("main", {
    pageTitle: "Scrap-a-rent",
  });
});

app.get("/data-source/:dataSource", async (req, res) => {
  const maxPrice = req.query.maxPrice;
  const dataSource = req.params.dataSource;
  const templateData = {
    pageTitle: `Data Source: ${dataSource}`,
    dataSource,
    data: [],
  };
  if (dataSource && DATA_SOURCE_NAME.hasOwnProperty(dataSource.toUpperCase())) {
    try {
      let fileData = (await getDataFromFile(dataSource)).data;
      templateData.data = cleanupList(fileData, maxPrice);
    } catch (e) {
      templateData.message = {
        text: `Could not find/load data for the ${dataSource} data source.`,
        isError: true,
      };
    }
  }
  return res.render("pages/data-source", templateData);
});

app.get("/trigger-extraction", async (req, res) => {
  const keys = Object.keys(DATA_SOURCE_NAME);
  const templateData = {
    keys,
    DATA_SOURCE_NAME,
    message: {
      text: "Success. The data has been extracted successfully!",
      isError: false,
    },
  };

  res.render("pages/extraction", {
    ...templateData,
    pageTitle: "Trigger Extraction",
  });
});

app.post("/trigger-extraction", async (req, res) => {
  const keys = Object.keys(DATA_SOURCE_NAME);
  const templateData = {
    keys,
    DATA_SOURCE_NAME,
    message: {
      text: "Success. The data has been extracted successfully!",
      isError: false,
    },
  };
  const { dataSource } = req.body;
  try {
    getDataFromSource(dataSource);
  } catch (e) {
    templateData.message = {
      text: "Error. The data could not be extracted. See logs!",
      isError: true,
    };
  }

  res.render("pages/extraction", {
    ...templateData,
    pageTitle: "Trigger Extraction",
  });
});

app.get("/send-mail", (_req, res) => {
  res.render("pages/send-mail", {
    pageTitle: "Send Email",
  });
});

app.post("/send-mail", async (_req, res) => {
  let actionData = {
    message: {
      text: "Success. The email has been sent!",
      isError: false,
    },
  };

  try {
    sendEmail({
      templateFunc: EMAIL_TEMPLATES.getRentEmailTemplate,
      dataSource: DATA_SOURCE_NAME.IMOBILIARE,
    });
    sendEmail({
      templateFunc: EMAIL_TEMPLATES.getApartmentsEmailTemplate,
      dataSource: DATA_SOURCE_NAME.IMOBILIARE_APARTAMENT,
    });
  } catch (e) {
    actionData.message = {
      isError: true,
      text: "Error. Could not send the email!",
    };
  }
  res.render("pages/send-mail", {
    ...actionData,
    pageTitle: "Send Email",
  });
});

app.listen(PORT, () => {
  console.log(`Started ${APP_NAME} on port ${PORT}`);
});
