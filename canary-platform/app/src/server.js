const express = require("express");
const os = require("os");

const app = express();
const port = process.env.PORT || 3000;

const appVersion = process.env.APP_VERSION || "2.0.0";
const release = process.env.RELEASE || "stable";

app.get("/", (req, res) => {
  res.json({
    message:`Kubernetes Canary Deployment Platform - v${appVersion}`,
    version: appVersion,
    release,
    hostname: os.hostname()
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    version: appVersion
  });
});

app.get("/ready", (req, res) => {
  res.status(200).json({
    status: "ready"
  });
});

app.listen(port, "0.0.0.0", () => {
  console.log(
    `Canary demo app listening on port ${port} (${release} ${appVersion})`
  );
});
