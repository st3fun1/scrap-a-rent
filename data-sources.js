import cheerio from "cheerio";
import { goToPage } from "./browser.js";
import { RENT_EXTRACTORS } from "./extractors.js";
import { fetchPageHTML } from "./helpers.js";

export const DATA_SOURCES = {
  imobiliare: "https://www.imobiliare.ro/inchirieri-garsoniere/iasi",
};

export const DATA_SOURCE_NAME = {
  IMOBILIARE: "IMOBILIARE",
};

const MAX_SCRAPPED_PAGES = 8;

export async function fetchFromImobiliare() {
  return await goToPage(DATA_SOURCES.imobiliare);
}

export async function fetchFromImobiliareStatic(items = [], currentPage = 1) {
  if (currentPage === MAX_SCRAPPED_PAGES) {
    return items;
  }
  const htmlData = await fetchPageHTML(
    `${DATA_SOURCES.imobiliare}?pagina=${currentPage}`
  );
  console.log("HTML DATA", htmlData ? "yes" : "no");

  const $ = cheerio.load(htmlData);
  let currentItems = items;
  $(".box-anunt").each(async (i, el) => {
    currentItems.push(await RENT_EXTRACTORS.imobiliare($, i, el));
  });

  return fetchFromImobiliareStatic(currentItems, currentPage + 1);
}

export function fetchFromDataSource(datasource) {
  switch (datasource) {
    case DATA_SOURCE_NAME.IMOBILIARE:
      return fetchFromImobiliareStatic();
    default:
      return Promise.reject({
        error: "This data source doesn't exist",
      });
  }
}
