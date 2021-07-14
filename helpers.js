import fetch from "node-fetch";

export const fetchPageHTML = async (url) => {
  return await fetch(url)
    .then((res) => res.text())
    .then((html) => html);
};

export const renderData = ({ data, date }) => `
<div class="container">
<h1>Apartments as of date: ${date}</h1>
${data
  .sort((a, b) => {
    return parseInt(a.price) > parseInt(b.price) ? 1 : -1;
  })
  .map((item) => {
    return `

    <div class="item">
      <h2>${item.title}</h2>
      <div>Agentie: ${item.agency}</div>
      <div>Localization: ${item.localization}</div>
      <div>Caracteristici: ${item.characteristics}</div>
      <div>Pret: ${item.price}</div>
      <a target="_blank" href="${item.link}">Link</a>
      <div>${item.description.reduce(
        (prev, current) => prev + "\n" + `<p>${current}</p>`,
        ""
      )}</div>
    </div>
  `;
  })
  .reduce((prev, current) => prev + "\n" + current, "")}
</div>`;
