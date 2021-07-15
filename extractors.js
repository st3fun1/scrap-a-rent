import cheerio from "cheerio";
import { fetchPageHTML } from "./helpers.js";

export const RENT_EXTRACTORS = {
  imobiliare: async ($, _index, el) => {
    const title = $(el).find(".titlu-anunt span").first().text();
    if (!title) {
      return null;
    }
    const link = $(el).find(".detalii-proprietate").attr("href");
    const details = await getRentDetails(link);
    return {
      title,
      agency: $(el).find(".logo-agentie img").attr("alt"),
      localization: $(el).find(".localizare p").text(),
      characteristics: getRentCharacteristics($, el),
      link,
      ...details,
    };
  },
};

const getRentCharacteristics = ($, parent) => {
  const listOfCharacteristics = [];
  $(parent)
    .find(".caracteristici li span")
    .each((_index, el) => {
      listOfCharacteristics.push($(el).text());
    });

  return listOfCharacteristics
    ? listOfCharacteristics.reduce((prev, current) => {
        if (prev !== "") {
          return prev + ", " + current;
        }
        return prev + current;
      }, "")
    : "";
};

const getRentDetails = async (link) => {
  const details = {};
  if (link) {
    const html = await fetchPageHTML(link);
    const $ = await cheerio.load(html);

    return {
      description: getDescription($),
      price: getRentPrice($),
    };
  }

  return details;
};

const getDescription = ($) => {
  const paragraphs = [];
  $("#b_detalii_text")
    .find("p")
    .each((_index, el) => {
      paragraphs.push($(el).text());
    });
  return paragraphs;
};

const getRentPrice = ($) => {
  return $(".pret-cerut span").text();
};
