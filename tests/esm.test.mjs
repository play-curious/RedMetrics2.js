import dotenv from "dotenv";
import path from "path";

describe("esm", async () => {
  dotenv.config({ path: path.join(__dirname, ".env") });

  if (!process.env.API_BASE_URL || !process.env.API_KEY) {
    throw new Error("Cannot find API_BASE_URL or API_KEY");
  }

  const RedMetrics = await import("../dist/esm/index.js");

  const client = new RedMetrics.WriteConnection({
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
    client.postEvent("start", {
      custom_data: {
        content: "Hello World!",
      },
    });

    client.postEvent({
      type: "end",
      custom_data: {
        content: "Another event!",
      },
    });

    const eventCount = await client.sendData();

    expect(eventCount).toEqual(2);
  });

  afterAll((cb) => {
    client
      .disconnect()
      .then(() => cb())
      .catch(cb);
  });
});
