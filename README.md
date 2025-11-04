# Homebridge WeatherXM

Homebridge plugin that exposes a WeatherXM station as separate HomeKit sensors.

## Features

- Exposes separate sensors (you can place them in any room):
  - Current temperature (Temperature Sensor)
  - Rain: raining/not raining (Leak Sensor) with logs for rate (mm/h) and accumulated (mm)
  - Atmospheric pressure (numeric on a CO₂ tile due to HomeKit limitations; real units are logged)
  - Wind speed (numeric, mapped to Light Sensor — units shown as lux)
  - Wind direction (numeric, mapped to Light Sensor — units shown as lux)
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
- The refresh interval is calculated pro‑rata on the remaining time of the current month from `apiCallsPerMonth` (e.g., if you start mid‑month, the plugin spreads the monthly cap over the remaining days).

### Where to find API Key and Station ID (WeatherXM PRO)

1. API Key

- Go to [pro.weatherxm.com](https://pro.weatherxm.com) and sign in.
- Open the side menu and go to "API Management".
- Create a new key if you don't already have one, then copy the value and paste it into Homebridge ("WeatherXM API Key" field).
- The key must be sent via the X-API-KEY header (the plugin handles this automatically).

1. Station ID

- Open the side menu and go to "Map", then select your station on the map.
- You can find the ID by clicking on a station and scrolling under "Station Info" to find "Station ID".
- Copy the ID and paste it into the "Station ID" field in the Homebridge configuration.

## Exposed sensors

- Temperature Sensor
- Leak Sensor (rain: raining/not raining; logs include rate/accumulation)
- CarbonDioxide Sensor (shows the numeric pressure value; real units are logged)
- Light Sensor (wind speed)
- Light Sensor (wind direction)
- Light Sensor (radiation)

## Troubleshooting

- Make sure the API key is valid and has access to the station.
- Enable `debug: true` for verbose logs.
- Check `weatherxm.log` in your Homebridge storage folder.

### “Accessory out of compliance” in Apple Home

- Don’t add the WeatherXM sensors individually from the Home app. This plugin exposes bridged accessories under the Homebridge bridge. Pair the Homebridge bridge (QR code) — the sensors will show up automatically.
- Ensure sensor values stay within HomeKit ranges (handled by the plugin since v2.1.5). If you still see issues, restart Homebridge and clear any cached duplicate accessories from the Homebridge UI.

## Home app limitations and unit workaround

Apple Home does not natively support many weather metrics (wind speed/direction, pressure, radiation) as dedicated services. To still show numbers in the Home app:

- Pressure is mapped to a Carbon Dioxide sensor: the tile label shows “ppm”, but the value you see is the pressure (hPa). Logs always include the real unit.
- Wind speed and wind direction are mapped to Ambient Light sensors: the tile label shows “lux”, but the values are respectively m/s and degrees.
- Radiation is mapped to Ambient Light as well. For all Ambient Light values, HomeKit requires a minimum of 0.0001 and a maximum of 100000; the plugin clamps values accordingly.

This design is intentional to surface numeric values in Home without requiring third‑party apps. If you prefer strictly correct units and charts, consider using an app that supports custom characteristics (e.g., Eve). In this plugin we prioritize visibility in Home and document the unit mismatch clearly.

We hope Apple will add native support for these weather metrics in the future, allowing for proper units and services.

## License

MIT © 2025 Tommaso Ceredi
