import express from "express";

const app = express();
const APP_NAME = "Scrap-a-Rent!";
const PORT = process.env.PORT || 14161;

app.get("/", (_req, res) => {
  res.send(`Hello from ${APP_NAME}`);
});

app.listen(PORT, () => {
  console.log(`Started ${APP_NAME} on port ${PORT}`);
});
