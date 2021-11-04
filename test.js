require("dotenv/config");

describe("cjs", () => {
  const RedMetrics = require(".");

  const client = new RedMetrics.Client({
    bufferingDelay: 1000,
    apiKey: process.env.API_KEY,
    apiConfig: RedMetrics.defaultDevConfig,
    gameSession: {
      gameVersionId: "7fe48815-5d14-4e35-9c49-adc5d782c9ae",
    },
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
