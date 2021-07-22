const { DATA_SOURCE_NAME } = require("./data-sources");
const moment = require("moment");
const { getHTMLListOfData } = require("./helpers");

const EMAIL_TEMPLATES = {
  getRentEmailTemplate: async (list) => {
    const emailTo =
      process.env.NODE_ENV === "development"
        ? "stefantimosenco@gmail.com"
        : "stefantimosenco@gmail.com, danielaandries26@gmail.com";
    return {
      to: emailTo,
      subject: `Apartamente cu o camera de inchiriat, Iasi, ${moment().format(
        "MMMM Do YYYY, h:mm:ss a"
      )}`,
      html: await getHTMLListOfData({
        list,
        targetPeople: "Dana, Stefan",
        dataSource: DATA_SOURCE_NAME.IMOBILIARE.toLowerCase(),
      }),
    };
  },
  getApartmentsEmailTemplate: async (list) => {
    const emailTo =
      process.env.NODE_ENV === "development"
        ? "stefantimosenco@gmail.com"
        : "stefantimosenco@gmail.com, timosenco.ioana@gmail.com";
    return {
      to: emailTo,
      subject: `Apartamente de vanzare, Bacau, ${moment().format(
        "MMMM Do YYYY, h:mm:ss a"
      )}`,
      html: await getHTMLListOfData({
        list,
        targetPeople: "Marina",
        dataSource: DATA_SOURCE_NAME.IMOBILIARE_APARTAMENT.toLowerCase(),
      }),
    };
  },
};

module.exports = {
  EMAIL_TEMPLATES,
};
