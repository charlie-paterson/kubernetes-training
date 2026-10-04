const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Hello from Kubernetes!",
    version: process.env.APP_VERSION || "1.0.0",
    hostname: require("os").hostname()
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.get("/ready", (req, res) => {
  res.status(200).json({ status: "ready" });
});

app.get("/cpu", (req, res) => {
  const end = Date.now() + 500;

  while (Date.now() < end) {
    Math.sqrt(Math.random());
  }

  res.json({ status: "done" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Application listening on port ${port}`);
});
