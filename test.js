require("dotenv/config");

describe("cjs", () => {
  const RedMetrics = require(".");

  console.log("found game ID", process.env.GAME_ID);

  const client = new RedMetrics.Client({
    bufferingDelay: 1000,
    apiKey: process.env.API_KEY,
    gameId: process.env.GAME_ID,
    apiConfig: {
      protocol: process.env.PROTOCOL,
      host: process.env.HOST,
      port: process.env.PORT,
    },
  });

  test("wait 2s", (cb) => {
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

  test("disconnect", (cb) => {
    client
      .disconnect()
      .then(() => cb())
      .catch(cb);
  });
});
