const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

if (!process.env.API_BASE_URL || !process.env.API_KEY) {
  throw new Error("Cannot find API_BASE_URL or API_KEY");
}

describe("cjs", () => {
  const RedMetrics = require("../dist/cjs/index.js");

  const client = new RedMetrics({
    bufferingDelay: 100000,
    baseUrl: process.env.API_BASE_URL,
    apiKey: process.env.API_KEY,
  });

  test("connexion", (cb) => {
    client
      .connect()
      .then(() => cb())
      .catch(cb);
  });

  test("is connected", () => {
    expect(client.isConnected).toBeTruthy();
  });

  test("send events", async () => {
    client.emit("start", {
      custom_data: {
        content: "Hello World!",
      },
    });

    client.emit("end", {
      custom_data: {
        content: "Another event!",
      },
    });

    const buffed = await client.buff();

    expect(buffed).toBeTruthy();
  });

  afterAll((cb) => {
    client
      .disconnect()
      .then(() => cb())
      .catch(cb);
  });
});
