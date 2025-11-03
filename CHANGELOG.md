# Changelog

Tutte le modifiche rilevanti a questo progetto verranno documentate in questo file.

## [2.1.1] - 2025-11-04

### Changes

- Compatibilità esplicita con Homebridge v2 (`engines.homebridge: ^1.6.0 || ^2.0.0`).
- Impostato `displayName`: "Homebridge WeatherXM".

## [2.1.0] - 2025-11-04

### Additions

- Log dell'orario del prossimo fetch API (ISO8601) dopo ogni aggiornamento e quando viene rispettato l'intervallo.

### Changes

- Wind come `MotionSensor` (icona distinta, nessuna unità "lux").
- Pressure come `CarbonDioxideSensor` per mostrare un valore numerico con icona dedicata (unità hPa indicate nei log).

## [2.0.3] - 2025-11-04

### Fixes

- Header API corretto: invio `X-API-KEY` verso `https://pro.weatherxm.com/api/v1`.

### Changes

- Pressure evitata mappatura su `TemperatureSensor`/`LightSensor` per limiti/icone.

## [2.0.2] - 2025-11-03

### Additions

- Rotazione log semplice (1MB) per evitare crescita infinita.

### Changed

- Precipitation come `LeakSensor` (solo sensore, niente switch). Usa `precipitation_rate` per "piove/non piove" e logga `accumulated`.

## [2.0.1] - 2025-11-03

### Fixes

- Endpoint corretto: `GET /stations/{station_id}/latest` su `pro.weatherxm.com`. Normalizzazione dei campi da `observation`.

## [2.0.0] - 2025-11-03

### Breaking Changes

- `stationId` ora OBBLIGATORIO; rimossi `stationName` e `minRefreshSeconds`.
- Intervallo di refresh calcolato solo su `apiCallsPerMonth`.

### Changes

- `storagePath`: usa `api.user.storagePath()` quando disponibile.

## [1.0.1] - 2025-11-03

### Fixes

- Rimozione dipendenza non usata `uuid` che causava errore all'avvio.

## [1.0.0] - 2025-11-03

### Additions

- Prima release: temperature, precipitation, pressure, wind, radiation; configurazione UI (`config.schema.json`); packaging npm.


[2.1.1]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.1.1
[2.1.0]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.1.0
[2.0.3]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.0.3
[2.0.2]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.0.2
[2.0.1]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.0.1
[2.0.0]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.0.0
[1.0.1]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v1.0.1
[1.0.0]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v1.0.0