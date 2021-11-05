require("dotenv/config");

describe("cjs", () => {
  const RedMetrics = require("../dist/cjs");

  const client = new RedMetrics.Client({
    bufferingDelay: 1000,
    baseUrl: process.env.API_BASE_URL,
    apiKey: process.env.API_KEY,
  });

  beforeAll((cb) => {
    setTimeout(() => cb(), 2000);
  });

  test("is connected", () => {
    expect(client.isConnected).toBeTruthy();
  });

  test("send events", () => {
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
  });

  afterAll((cb) => {
    client
      .disconnect()
      .then(() => cb)
      .catch(cb);
  });
});
