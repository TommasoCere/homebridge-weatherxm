# Changelog

Tutte le modifiche rilevanti a questo progetto verranno documentate in questo file.

## [2.1.2] - 2025-11-04

### Fixes — 2.1.2

- Normalizzazione campi precipitazioni nell'API client: aggiunti `precipitation_rate` (mm/h) e `precipitation_accumulated` (mm) per coerenza con l'accessorio Precipitation.

### Docs/UI

- README: guida passo-passo su dove trovare API Key e Station ID su WeatherXM PRO.
- Config UI (`config.schema.json`): descrizioni dettagliate sotto i campi, placeholder, mascheramento chiave.

## [2.1.1] - 2025-11-04

### Changes — 2.1.1

- Compatibilità esplicita con Homebridge v2 (`engines.homebridge: ^1.6.0 || ^2.0.0`).
- Impostato `displayName`: "Homebridge WeatherXM".

## [2.1.0] - 2025-11-04

### Additions — 2.1.0

- Log dell'orario del prossimo fetch API (ISO8601) dopo ogni aggiornamento e quando viene rispettato l'intervallo.

### Changes — 2.1.0

- Wind come `MotionSensor` (icona distinta, nessuna unità "lux").
- Pressure come `CarbonDioxideSensor` per mostrare un valore numerico con icona dedicata (unità hPa indicate nei log).

## [2.0.3] - 2025-11-04

### Fixes — 2.0.3

- Header API corretto: invio `X-API-KEY` verso `https://pro.weatherxm.com/api/v1`.

### Changes — 2.0.3

- Pressure evitata mappatura su `TemperatureSensor`/`LightSensor` per limiti/icone.

## [2.0.2] - 2025-11-03

### Additions — 2.0.2

- Rotazione log semplice (1MB) per evitare crescita infinita.

### Changes — 2.0.2

- Precipitation come `LeakSensor` (solo sensore, niente switch). Usa `precipitation_rate` per "piove/non piove" e logga `accumulated`.

## [2.0.1] - 2025-11-03

### Fixes — 2.0.1

- Endpoint corretto: `GET /stations/{station_id}/latest` su `pro.weatherxm.com`. Normalizzazione dei campi da `observation`.

## [2.0.0] - 2025-11-03

### Breaking Changes — 2.0.0

- `stationId` ora OBBLIGATORIO; rimossi `stationName` e `minRefreshSeconds`.
- Intervallo di refresh calcolato solo su `apiCallsPerMonth`.

### Changes — 2.0.0

- `storagePath`: usa `api.user.storagePath()` quando disponibile.

## [1.0.1] - 2025-11-03

### Fixes — 1.0.1

- Rimozione dipendenza non usata `uuid` che causava errore all'avvio.

## [1.0.0] - 2025-11-03

### Additions — 1.0.0

- Prima release: temperature, precipitation, pressure, wind, radiation; configurazione UI (`config.schema.json`); packaging npm.


[2.1.1]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.1.1
[2.1.2]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.1.2
[2.1.0]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.1.0
[2.0.3]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.0.3
[2.0.2]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.0.2
[2.0.1]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.0.1
[2.0.0]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v2.0.0
[1.0.1]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v1.0.1
[1.0.0]: https://github.com/TommasoCere/homebridge-weatherxm/releases/tag/v1.0.0
