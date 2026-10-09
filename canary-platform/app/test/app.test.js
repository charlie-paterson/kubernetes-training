const test = require("node:test");
const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");

test("application responds with the configured version and release", async (t) => {
const port = 3100 + Math.floor(Math.random() * 1000);

const app = spawn("node", ["src/server.js"], {
env: {
...process.env,
PORT: String(port),
APP_VERSION: "2.0.1",
RELEASE: "canary",
},
stdio: "ignore",
});

t.after(() => app.kill());

let response;
for (let attempt = 0; attempt < 30; attempt++) {
try {
response = await fetch(`http://127.0.0.1:${port}/`);
break;
} catch {
await new Promise((resolve) => setTimeout(resolve, 200));
}
}

assert.ok(response, "application should start and accept requests");
assert.equal(response.status, 200);

const body = await response.json();
assert.equal(body.version, "2.0.1");
assert.equal(body.release, "canary");
assert.match(body.message, /v2.0.1/);
assert.ok(body.hostname);
});
