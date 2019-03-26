# Plunger
A simple retry operation javascript library

## Feature

- Provides easy support for scene where there are operations that require retrying

## Install

`npm i plunger`

## Usage

```typescript
import Plunger from 'plunger';

const retryCount = 3;

const plunger = new Plunger((accept, reject) => {
    device.readSensorData(deviceId, payload, (err: string, data: any) => {
        if (err) {
            return reject(err);
        }
        try {
            const buf = new Buffer(data.rs485, 'hex');
            const result = {
                humidity: buf.readInt16BE(3) / 10,
                temperature: buf.readInt16BE(5) / 10,
                lightIntensity: buf.readInt32BE(13)
            };
            accept(result);
        } catch (e) {
            reject('Failed to parse sensor data: ' + e.message);
        }
    });
});
plunger.on('failed', (errmsg: string) => {
    console.error("Error:", errmsg);
});
plunger.on('completed', (result: any) => {
    console.log("Completed!", result);
});
plunger.plunge(retryCount);

```

### Events

- failed: Emit the last failed error message after always failing
- completed: After the function `accept` is executed once, it is considered to be completed.