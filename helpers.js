import fetch from "node-fetch";

export const fetchPageHTML = async (url) => {
  return await fetch(url)
    .then((res) => res.text())
    .then((html) => html);
};
