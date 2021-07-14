import cheerio from "cheerio";
import { fetchPageHTML } from "./helpers.js";

export const RENT_EXTRACTORS = {
  imobiliare: async ($, _index, el) => {
    const link = $(el).find(".detalii-proprietate").attr("href");
    return {
      title: $(el).find(".titlu-anunt span").first().text(),
      agency: $(el).find(".logo-agentie img").attr("alt"),
      localization: $(el).find(".localizare p").text(),
      characteristics: getRentCharacteristics($, el),
      price: getRentPrice($, $(el).find(".pret")),
      link,
      description: await getDescription(link),
    };
  },
};

const getRentPrice = ($, el) => {
  return (
    $(el).children(".pret-mare").text() +
    " " +
    $(el).children(".tva-luna").text()
  );
};

const getRentCharacteristics = ($, parent) => {
  const listOfCharacteristics = [];
  $(parent)
    .find(".caracteristici li span")
    .each((_index, el) => {
      listOfCharacteristics.push($(el).text());
    });

  return listOfCharacteristics.reduce((prev, current) => {
    if (prev !== "") {
      return prev + ", " + current;
    }
    return prev + current;
  }, "");
};

const getDescription = async (link) => {
  const paragraphs = [];
  if (link) {
    const html = await fetchPageHTML(link);
    const $ = await cheerio.load(html);

    $("#b_detalii_text")
      .find("p")
      .each((index, el) => {
        paragraphs.push($(el).text());
      });
  }
  return paragraphs;
};
