import moment from "moment";
import { renderData } from "./helpers.js";
const HOST_NAME = "http://188.166.167.30";

export const RENT_EMAIL_TEMPLATE = (list, date) => {
  return {
    from: "admin@scrap-a-rent.com",
    to: "stefantimosenco@gmail.com, danielaandries26@gmail.com",
    subject: `Apartamente cu o camera de inchiriat extrase pe data de ${moment().format(
      "MMMM Do YYYY, h:mm:ss a"
    )}`,
    html: `Salut, 
      <p>Salut,\n
      Stefan, Dana, mai jos veti gasi ultimile garsoniere de inchiriat colectate:<p>
      ${renderData({
        data: list.slice(0, 10),
        date,
      })}
      <p>Pentru a vedea o lista completa click <a style="color: blue; font-weight: bold; text-decoration: none" href="${HOST_NAME}/data-source/imobiliare">aici</a></p>
      `,
  };
};

export const APARTMENT_TEMPLATE = (list, date) => {
  return {
    from: "admin@scrap-a-rent.com",
    to: "stefantimosenco@gmail.com, timosenco.ioana@gmail.com",
    subject: `Apartamente de vanzare in Bacau extrase in ${moment().format(
      "MMMM Do YYYY, h:mm:ss a"
    )}`,
    html: `
        <p>Salut,\n
        Marina,
        mai jos vei gasi ultimile apartamente de vanzare colectate:<p>
        ${renderData({
          data: list.slice(0, 10),
          date,
        })}
        <p>Pentru a vedea o lista completa click <a style="color: blue; font-weight: bold; text-decoration: none" href="${HOST_NAME}/data-source/imobiliare_apartament">aici</a></p>
        `,
  };
};
