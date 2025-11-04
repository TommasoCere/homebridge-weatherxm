# Changelog

All notable changes to this project will be documented in this file.

## [2.1.4] - 2025-11-04

### Fixed — 2.1.4

- Radiation: handle 0 as a valid value (avoid treating it as null). Use proper null checks and keep clamping to 0.0001 for HomeKit.

## [2.1.3] - 2025-11-04

### Docs — 2.1.3

- README and CHANGELOG translated to English. Future updates will be in English.

## [2.1.2] - 2025-11-04

### Fixed — 2.1.2

- Normalize precipitation fields in API client: added `precipitation_rate` (mm/h) and `precipitation_accumulated` (mm) to match the Precipitation accessory.

### Docs/UI — 2.1.2

- README: step-by-step guide on where to find API Key and Station ID on WeatherXM PRO.
- Config UI (`config.schema.json`): detailed descriptions under fields, placeholders, key masking.

## [2.1.1] - 2025-11-04

### Changed — 2.1.1

- Explicit Homebridge v2 compatibility (`engines.homebridge: ^1.6.0 || ^2.0.0`).
- Set `displayName`: "Homebridge WeatherXM".

## [2.1.0] - 2025-11-04

### Added — 2.1.0

- Log the time of the next allowed API fetch (ISO8601) after each update and when the interval is respected.

### Changed — 2.1.0

- Wind as `MotionSensor` (distinct icon, no "lux" unit).
- Pressure as `CarbonDioxideSensor` to display a numeric value with a dedicated icon (real unit hPa noted in logs).

## [2.0.3] - 2025-11-04

### Fixed — 2.0.3

- Correct API header: send `X-API-KEY` to `https://pro.weatherxm.com/api/v1`.

### Changed — 2.0.3

- Avoid mapping Pressure to `TemperatureSensor`/`LightSensor` due to limitations/icon mismatch.

## [2.0.2] - 2025-11-03

### Added — 2.0.2

- Simple log rotation (1MB) to avoid unbounded growth.

### Changed — 2.0.2

- Precipitation as `LeakSensor` (sensor only, no switch). Uses `precipitation_rate` for raining/not raining and logs `accumulated`.

## [2.0.1] - 2025-11-03

### Fixed — 2.0.1

- Correct endpoint: `GET /stations/{station_id}/latest` on `pro.weatherxm.com`. Normalize fields from `observation`.

## [2.0.0] - 2025-11-03

### Breaking Changes — 2.0.0

- `stationId` is now REQUIRED; removed `stationName` and `minRefreshSeconds`.
- Refresh interval computed solely from `apiCallsPerMonth`.

### Changed — 2.0.0

- `storagePath`: use `api.user.storagePath()` when available.

## [1.0.1] - 2025-11-03

### Fixed — 1.0.1

- Remove unused `uuid` dependency causing startup error.

## [1.0.0] - 2025-11-03

### Added — 1.0.0

- First release: temperature, precipitation, pressure, wind, radiation; UI configuration (`config.schema.json`); npm packaging.


[2.1.4]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.1.4
[2.1.3]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.1.3
[2.1.2]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.1.2
[2.1.1]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.1.1
[2.1.0]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.1.0
[2.0.3]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.0.3
[2.0.2]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.0.2
[2.0.1]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.0.1
[2.0.0]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.0.0
[1.0.1]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v1.0.1
[1.0.0]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v1.0.0
