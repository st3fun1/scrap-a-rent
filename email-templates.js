const { DATA_SOURCE_NAME } = require("./data-sources");
const moment = require("moment");
const { getHTMLListOfData } = require("./helpers");
const HOST_NAME = process.env.HOST_NAME;

const EMAIL_TEMPLATES = {
  getRentEmailTemplate: async (list) => {
    return {
      to: "stefantimosenco@gmail.com, danielaandries26@gmail.com",
      subject: `Apartamente cu o camera de inchiriat, Iasi, ${moment().format(
        "MMMM Do YYYY, h:mm:ss a"
      )}`,
      html: await getHTMLListOfData({
        list,
        targetPeople: "Dana, Stefan",
        host: HOST_NAME,
        dataSource: DATA_SOURCE_NAME.IMOBILIARE.toLowerCase(),
      }),
    };
  },
  getApartmentsEmailTemplate: async (list) => {
    return {
      to: "stefantimosenco@gmail.com, timosenco.ioana@gmail.com",
      subject: `Apartamente de vanzare, Bacau, ${moment().format(
        "MMMM Do YYYY, h:mm:ss a"
      )}`,
      html: await getHTMLListOfData({
        list,
        targetPeople: "Marina",
        host: HOST_NAME,
        dataSource: DATA_SOURCE_NAME.IMOBILIARE_APARTAMENT.toLowerCase(),
      }),
    };
  },
};

module.exports = {
  EMAIL_TEMPLATES,
};
