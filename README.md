# homebridge-weatherxm

Plugin Homebridge per esporre i dati di una stazione WeatherXM come sensori HomeKit separati.

## Caratteristiche

- Espone sensori separati (li puoi posizionare in qualunque stanza):
  - Temperatura attuale
  - Precipitazione giornaliera (mm/day)
  - Pressione atmosferica
  - Velocità del vento (con log della direzione)
  - Radiazione solare
- Risoluzione automatica di `stationName` → `stationId` (se non conosci l'ID)
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
      "stationId": "<ID_STAZIONE_OPZIONALE>",
      "stationName": "<NOME_STAZIONE_OPZIONALE>",
      "apiCallsPerMonth": 1000,
      "minRefreshSeconds": 300,
      "logToFile": true,
      "debug": false
    }
  ]
}
```

Note:

- Imposta almeno `apiKey`.
- Puoi specificare `stationId` oppure solo `stationName` (verrà risolto automaticamente).
- L'intervallo di aggiornamento è calcolato per rispettare il limite mensile (`apiCallsPerMonth`) e non scendere sotto `minRefreshSeconds`.

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
