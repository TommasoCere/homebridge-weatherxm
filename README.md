# Homebridge WeatherXM

Plugin Homebridge per esporre i dati di una stazione WeatherXM come sensori HomeKit separati.

## Caratteristiche

- Espone sensori separati (li puoi posizionare in qualunque stanza):
  - Temperatura attuale
  - Precipitazione giornaliera (mm/day)
  - Pressione atmosferica
  - Velocità del vento (con log della direzione)
  - Radiazione solare
- Rate limiting configurabile per rispettare le chiamate API gratuite (es. 1000/mese)
- Log su console e su file (`weatherxm.log`)
- Configurazione tramite Homebridge UI (config.schema.json)

## Requisiti

- Node.js >= 18
- Homebridge >= 1.6
- Chiave API WeatherXM (token Bearer)

## Installazione

Installazione globale (Homebridge):

```powershell
npm install -g homebridge-weatherxm
```

Oppure dalla Homebridge UI cercando "homebridge-weatherxm".

## Configurazione

La configurazione può essere effettuata dalla Homebridge UI (schema incluso) oppure manualmente nel file `config.json`.

Esempio di configurazione:

```json
{
  "platforms": [
    {
      "platform": "WeatherXM",
      "name": "WeatherXM",
      "apiKey": "<LA_TUA_API_KEY>",
      "stationId": "<ID_STAZIONE>",
      "apiCallsPerMonth": 1000,
      "logToFile": true,
      "debug": false
    }
  ]
}
```

Note:

- `apiKey` e `stationId` sono obbligatori.
- L'intervallo di aggiornamento è calcolato esclusivamente sul limite mensile (`apiCallsPerMonth`).

## Sensori esposti

- Temperature Sensor
- Rain (precipitazione giornaliera)
- Pressure Sensor
- Wind (velocità; registra anche la direzione nei log)
- Solar Radiation

## Risoluzione problemi

- Verifica che la chiave API sia corretta e abbia accesso alla stazione.
- Abilita `debug: true` per log dettagliati.
- Controlla `weatherxm.log` nella cartella di storage di Homebridge.

## Licenza

MIT © 2025 Tommaso Ceredi
