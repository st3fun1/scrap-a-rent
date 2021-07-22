const cheerio = require("cheerio");
const { goToPage } = require("./browser");
const { RENT_EXTRACTORS } = require("./extractors");
const { fetchPageHTML } = require("./helpers");

const DATA_SOURCES = {
  imobiliare: "https://www.imobiliare.ro/inchirieri-garsoniere/iasi",
  imobiliare_apartament: "https://www.imobiliare.ro/vanzare-apartamente/bacau",
};

const DATA_SOURCE_NAME = {
  IMOBILIARE: "IMOBILIARE",
  IMOBILIARE_APARTAMENT: "IMOBILIARE_APARTAMENT",
};

const MAX_SCRAPPED_PAGES = 8;

async function fetchFromImobiliare() {
  return await goToPage(DATA_SOURCES.imobiliare);
}

async function fetchFromImobiliareStatic(url, items = [], currentPage = 1) {
  if (currentPage === MAX_SCRAPPED_PAGES) {
    return items;
  }
  const htmlData = await fetchPageHTML(`${url}?pagina=${currentPage}`);

  const $ = cheerio.load(htmlData);
  let currentItems = items;
  $(".box-anunt").each(async (i, el) => {
    const data = await RENT_EXTRACTORS.imobiliare($, i, el);
    // remove data that isn't valid
    if (data && data.price) {
      currentItems.push(data);
    }
  });

  return fetchFromImobiliareStatic(url, currentItems, currentPage + 1);
}

function fetchFromDataSource(datasource) {
  switch (datasource) {
    case DATA_SOURCE_NAME.IMOBILIARE:
      return fetchFromImobiliareStatic(DATA_SOURCES.imobiliare);
    case DATA_SOURCE_NAME.IMOBILIARE_APARTAMENT:
      return fetchFromImobiliareStatic(DATA_SOURCES.imobiliare_apartament);
    default:
      return Promise.reject({
        error: "This data source doesn't exist",
      });
  }
}

module.exports = {
  fetchFromDataSource,
  fetchFromImobiliareStatic,
  fetchFromImobiliare,
  DATA_SOURCE_NAME,
  DATA_SOURCES,
};
