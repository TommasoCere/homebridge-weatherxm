# Homebridge WeatherXM

Plugin Homebridge per esporre i dati di una stazione WeatherXM come sensori HomeKit separati.

## Caratteristiche

- Espone sensori separati (li puoi posizionare in qualunque stanza):
  - Temperatura attuale (Temperature Sensor)
  - Pioggia: stato piove/non piove (Leak Sensor) con log di rate (mm/h) e accumulata (mm)
  - Pressione atmosferica (mostrata come valore numerico su tile CO₂ per limiti HomeKit; unità reali nei log)
  - Vento: rilevato sopra soglia (Motion Sensor) e direzione nei log
  - Radiazione solare (Light Sensor)
- Rate limiting configurabile per rispettare le chiamate API gratuite (es. 1000/mese)
- Log su console e su file (`weatherxm.log`)
- Configurazione tramite Homebridge UI (config.schema.json)

## Requisiti

- Node.js >= 18
- Homebridge >= 1.6 (compatibile anche con Homebridge v2)
- Chiave API WeatherXM (header X-API-KEY)

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

### Dove trovare API Key e Station ID (WeatherXM PRO)

1. API Key

- Vai su [pro.weatherxm.com](https://pro.weatherxm.com) ed effettua l'accesso con il tuo account.
- Apri il menu laterale e vai su "API Management".
- Crea una nuova chiave se non ne hai già una, quindi copia il valore e incollalo in Homebridge (campo “WeatherXM API Key”).
- La chiave va inviata come header X-API-KEY (il plugin se ne occupa automaticamente).

1. Station ID

- Apri il menu laterale e vai su "Map", quindi seleziona la tua stazione nella mappa.
- Trovi l'ID cliccando su una stazione e scorrendo in "Station info" troverai "Station ID".
- Copia l'ID e incollalo nel campo “Station ID” della configurazione in Homebridge.

## Sensori esposti

- Temperature Sensor
- Leak Sensor (pioggia: piove/non piove; log con rate/accumulo)
- CarbonDioxide Sensor (mostra il valore numerico della pressione; unità reali nei log)
- Motion Sensor (vento sopra soglia; direzione nei log)
- Light Sensor (radiazione)

## Risoluzione problemi

- Verifica che la chiave API sia corretta e abbia accesso alla stazione.
- Abilita `debug: true` per log dettagliati.
- Controlla `weatherxm.log` nella cartella di storage di Homebridge.

## Licenza

MIT © 2025 Tommaso Ceredi
