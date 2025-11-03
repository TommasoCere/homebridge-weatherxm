const axios = require('axios');

class WeatherXMApiClient {
  /**
   * apiKey: string
   * stationId: string (required)
   * logger: Logger instance
   * storagePath: path where to store small cache file (optional)
   */
  constructor({ apiKey, stationId, logger, storagePath }) {
    if (!apiKey) throw new Error('apiKey required');
    this.apiKey = apiKey;
    this.stationId = stationId || null;
    this.logger = logger;
    // Use the PRO endpoint as required by WeatherXM for station data
    this.base = 'https://pro.weatherxm.com/api/v1';
    this.storagePath = storagePath || '.';
    this.cacheFile = `${this.storagePath}/weatherxm_station_cache.json`;
  }

  _headers() {
    return { Authorization: `Bearer ${this.apiKey}` };
  }

  // Removed name-based resolution: stationId is required

  setStationId(id) {
    this.stationId = id;
  }

  async getLatestData() {
    if (!this.stationId) throw new Error('stationId not set');
    // Correct endpoint: /stations/{station_id}/latest
    const url = `${this.base}/stations/${encodeURIComponent(this.stationId)}/latest`;
    this.logger.debug('Fetching latest data from', url);
    try {
      const resp = await axios.get(url, { headers: this._headers(), timeout: 10000 });
      // Response example uses `observation` object. Normalize into the plugin's expected shape.
      // Expected plugin fields (used by accessories):
      // temperature, precipitation_daily (or precipitation), pressure, wind_speed, wind_direction, solar_radiation (or radiation), etc.
      const body = resp.data || {};
      const obs = body.observation || body.data || body;
      if (!obs) return null;
      const normalized = {
        // direct pass-through where names match
        temperature: obs.temperature != null ? obs.temperature : null,
        pressure: obs.pressure != null ? obs.pressure : (obs.pressure_pa != null ? obs.pressure_pa / 100 : null),
        wind_speed: obs.wind_speed != null ? obs.wind_speed : obs.wind != null ? obs.wind : null,
        wind_direction: obs.wind_direction != null ? obs.wind_direction : obs.wind_dir != null ? obs.wind_dir : null,
        // precipitation acc/ rate mapping
        precipitation: obs.precipitation_accumulated != null ? obs.precipitation_accumulated : (obs.precipitation != null ? obs.precipitation : null),
        precipitation_daily: obs.precipitation_accumulated != null ? obs.precipitation_accumulated : (obs.precipitation_daily != null ? obs.precipitation_daily : null),
        // solar / radiation
        solar_radiation: obs.solar_irradiance != null ? obs.solar_irradiance : (obs.solar_radiation != null ? obs.solar_radiation : null),
        radiation: obs.solar_irradiance != null ? obs.solar_irradiance : (obs.radiation != null ? obs.radiation : null),
        uv_index: obs.uv_index != null ? obs.uv_index : null,
        humidity: obs.humidity != null ? obs.humidity : null,
        // include raw observation for advanced users
        _raw_observation: obs
      };
      return normalized;
    } catch (e) {
      const status = e && e.response && e.response.status;
      if (status === 404) {
        this.logger.error('getLatestData failed: 404 Not Found - stationId non valido o nessun dato disponibile. Controlla stationId e permessi API.');
        return null; // non interrompe il ciclo; ritenta al prossimo intervallo
      }
      const body = e && e.response && e.response.data ? JSON.stringify(e.response.data) : '';
      this.logger.error('getLatestData failed:', e.message, body);
      return null;
    }
  }

  // For possible future: getHistory(from,to)
}

module.exports = { WeatherXMApiClient };
