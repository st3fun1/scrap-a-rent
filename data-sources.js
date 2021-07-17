import cheerio from "cheerio";
import { goToPage } from "./browser.js";
import { RENT_EXTRACTORS } from "./extractors.js";
import { fetchPageHTML } from "./helpers.js";

export const DATA_SOURCES = {
  imobiliare: "https://www.imobiliare.ro/inchirieri-garsoniere/iasi",
  imobiliare_apartament: "https://www.imobiliare.ro/vanzare-apartamente/bacau",
};

export const DATA_SOURCE_NAME = {
  IMOBILIARE: "IMOBILIARE",
  IMOBILIARE_APARTAMENT: "IMOBILIARE_APARTAMENT",
};

const MAX_SCRAPPED_PAGES = 8;

export async function fetchFromImobiliare() {
  return await goToPage(DATA_SOURCES.imobiliare);
}

export async function fetchFromImobiliareStatic(
  url,
  items = [],
  currentPage = 1
) {
  if (currentPage === MAX_SCRAPPED_PAGES) {
    return items;
  }
  const htmlData = await fetchPageHTML(`${url}?pagina=${currentPage}`);

  const $ = cheerio.load(htmlData);
  let currentItems = items;
  $(".box-anunt").each(async (i, el) => {
    const data = await RENT_EXTRACTORS.imobiliare($, i, el);
    if (data) {
      currentItems.push(data);
    }
  });

  return fetchFromImobiliareStatic(url, currentItems, currentPage + 1);
}

export function fetchFromDataSource(datasource) {
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
