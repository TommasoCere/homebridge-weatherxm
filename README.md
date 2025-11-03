# Homebridge WeatherXM

Homebridge plugin that exposes a WeatherXM station as separate HomeKit sensors.

## Features

- Exposes separate sensors (you can place them in any room):
  - Current temperature (Temperature Sensor)
  - Rain: raining/not raining (Leak Sensor) with logs for rate (mm/h) and accumulated (mm)
  - Atmospheric pressure (displayed as a numeric value on a CO₂ tile due to HomeKit limitations; real units are logged)
  - Wind: detected above threshold (Motion Sensor) with direction in logs
  - Solar radiation (Light Sensor)
- Configurable rate limiting to respect the free API quota (e.g., 1000/month)
- Logs to console and file (`weatherxm.log`)
- Configuration via Homebridge UI (`config.schema.json`)

## Requirements

- Node.js >= 18
- Homebridge >= 1.6 (also compatible with Homebridge v2)
- WeatherXM API Key (X-API-KEY header)

## Installation

Global install (Homebridge):

```powershell
npm install -g homebridge-weatherxm
```

Or install from the Homebridge UI by searching for "homebridge-weatherxm".

## Configuration

You can configure the plugin from the Homebridge UI (schema included) or manually in `config.json`.

Example configuration:

```json
{
  "platforms": [
    {
      "platform": "WeatherXM",
      "name": "WeatherXM",
      "apiKey": "<YOUR_API_KEY>",
      "stationId": "<STATION_ID>",
      "apiCallsPerMonth": 1000,
      "logToFile": true,
      "debug": false
    }
  ]
}
```

Notes:

- `apiKey` and `stationId` are required.
- The refresh interval is calculated only from the monthly cap (`apiCallsPerMonth`).

### Where to find API Key and Station ID (WeatherXM PRO)

1. API Key

- Go to [pro.weatherxm.com](https://pro.weatherxm.com) and sign in.
- Open “Settings” → “API Keys”.
- Create a new key if you don’t have one, then copy it and paste it in Homebridge (field “WeatherXM API Key”).
- The key must be sent via the X-API-KEY header (the plugin handles this automatically).

1. Station ID

- Go to “Stations” and select your station.
- You’ll find the ID under the station “Details” page; it’s also visible in the station page URL.
- Copy the ID and paste it in the “Station ID” field in Homebridge.

## Exposed sensors

- Temperature Sensor
- Leak Sensor (rain: raining/not raining; logs include rate/accumulation)
- CarbonDioxide Sensor (shows the numeric pressure value; real units are logged)
- Motion Sensor (wind above threshold; direction in logs)
- Light Sensor (radiation)

## Troubleshooting

- Make sure the API key is valid and has access to the station.
- Enable `debug: true` for verbose logs.
- Check `weatherxm.log` in your Homebridge storage folder.

## License

MIT © 2025 Tommaso Ceredi
