require("dotenv").config()

describe("cjs", () => {
    const RedMetrics = require(".")

    const client = new RedMetrics.Client({
        bufferingDelay: 1000,
        apiKey: process.env.API_KEY,
        apiConfig: RedMetrics.defaultDevConfig,
        gameSession: {
            gameVersionId: "a799a785-4841-402e-b484-e25479a6b2e4"
        }
    })

    test("wait 2s", (cb) => {
        setTimeout(() => cb(), 2000)
    })

    test("is connected", () => {
        expect(client.isConnected).toBeTruthy()
    })

    test("send events",() => {
        client.emit("start", {
            custom_data: {
                content: "Hello World!"
            }
        })

        client.emit("end", {
            custom_data: {
                content: "Another event!"
            }
        })
    })

    test("disconnect", (cb) => {
        client.disconnect()
            .then(() => cb)
            .catch(cb)
    })
})