const axios = require('axios');

class WeatherXMApiClient {
  /**
   * apiKey: string
   * stationId: optional string
   * stationName: optional string (used to resolve id)
   * logger: Logger instance
   * storagePath: path where to store small cache file (optional)
   */
  constructor({ apiKey, stationId, stationName, logger, storagePath }) {
    if (!apiKey) throw new Error('apiKey required');
    this.apiKey = apiKey;
    this.stationId = stationId || null;
    this.stationName = stationName || null;
    this.logger = logger;
    this.base = 'https://api.weatherxm.com/api/v1';
    this.storagePath = storagePath || '.';
    this.cacheFile = `${this.storagePath}/weatherxm_station_cache.json`;
  }

  _headers() {
    return { Authorization: `Bearer ${this.apiKey}` };
  }

  async listStations() {
    const url = `${this.base}/stations`;
    this.logger.debug('Calling GET', url);
    const resp = await axios.get(url, { headers: this._headers(), timeout: 10000 });
    return resp.data;
  }

  async resolveStationIdByName(name) {
    if (!name) throw new Error('stationName missing');
    this.logger.info(`Resolving station id for name "${name}"`);
    try {
      const list = await this.listStations();
      if (!Array.isArray(list)) {
        this.logger.error('Unexpected /stations response', JSON.stringify(list));
        throw new Error('Unexpected stations response');
      }
      const found = list.find(s => s.name && s.name.toLowerCase().trim() === name.toLowerCase().trim());
      if (!found) {
        // try partial match
        const partial = list.find(s => s.name && s.name.toLowerCase().includes(name.toLowerCase().trim()));
        if (partial) {
          this.logger.warn(`Exact name not found, using partial match "${partial.name}" (${partial.id})`);
          this._cacheStation(partial.id, partial.name);
          return partial.id;
        }
        throw new Error(`Station "${name}" not found in your WeatherXM account`);
      }
      this._cacheStation(found.id, found.name);
      return found.id;
    } catch (e) {
      this.logger.error('resolveStationIdByName error:', e.message);
      // try cache
      const cached = this._readCache();
      if (cached && cached.name && cached.name.toLowerCase() === name.toLowerCase()) {
        this.logger.warn('Using cached station id due to error');
        return cached.id;
      }
      throw e;
    }
  }

  _cacheStation(id, name) {
    try {
      const payload = { id, name, ts: Date.now() };
      require('fs').writeFileSync(this.cacheFile, JSON.stringify(payload, null, 2));
    } catch (e) {
      // ignore
    }
  }

  _readCache() {
    try {
      const fs = require('fs');
      if (!fs.existsSync(this.cacheFile)) return null;
      const raw = fs.readFileSync(this.cacheFile, 'utf8');
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

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
