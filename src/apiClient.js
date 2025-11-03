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
    this.base = 'https://api.weatherxm.com/api/v1';
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
    const url = `${this.base}/stations/${encodeURIComponent(this.stationId)}/data/latest`;
    this.logger.debug('Fetching latest data from', url);
    try {
      const resp = await axios.get(url, { headers: this._headers(), timeout: 10000 });
      // Response usually { station: {...}, data: {...} } — return contained data
      if (resp.data && resp.data.data) return resp.data.data;
      // fallback if API returns directly
      return resp.data;
    } catch (e) {
      this.logger.error('getLatestData failed:', e.message);
      throw e;
    }
  }

  // For possible future: getHistory(from,to)
}

module.exports = { WeatherXMApiClient };
