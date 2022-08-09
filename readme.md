# RedMetrics2.js

[RedMetrics2 (RM2)](https://github.com/play-curious/RedMetrics2) is a open-source open-data analytics service for online games and research.

This library helps send data from JavaScript applications (in the browser or on the desktop) to the online web service.

## Use

1. Import or include the library. 

Include dependency directly: 

```html
<script src="deps/rm2.bundle.js"></script>
```

Or import it:

```js
import { WriteConnection } from "rm2";
```

2. Create a connection object

```js
const redmetricsConnection = new rm2.WriteConnection({ 
  protocol: , // "http" or "https"
  host: , // host of the service
  port: , // optional
  apiKey: , // API key that corresponds to the game
  session: , // optional: information about the player session you would like recorded. Can be updated later 
});
```

3. Connect (async)

```js
redmetricsConnection.connect().then(function() {
  console.log("Connected to RM2");
}).catch(function() {
  console.error("Problem connecting");
});
```

4. Send events

```js
redmetricsConnection.postEvent({
  type: , // event name
  customData: { }, // optional 
});
```

5. Optionally, update the session in progress

```js
redmetricsConnection.updateSession({
  externalId: , 
  customData: ,  
});
```

## Development

Install dependencies with `npm install`.

### Tests

Copy `template.env` to `tests/.env` and fill in the environmental variables such as `API_KEY`.

Run tests with `npm run test`.

### Building

Build for multiple formats with `npm run bundle` or `npm run watch`.

### 
