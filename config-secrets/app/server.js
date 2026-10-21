const http = require("node:http");

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ status: "ok" }));
  }

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      message: process.env.APP_MESSAGE || "Default message",
      environment: process.env.APP_ENV || "development",
      secretConfigured: Boolean(process.env.API_TOKEN)
    }));
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Config demo listening on port 3000");
});