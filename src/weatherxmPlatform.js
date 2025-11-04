const { WeatherXMApiClient } = require('./apiClient');
const { Logger } = require('./logger');
const path = require('path');
const fs = require('fs');

const TemperatureAccessory = require('./accessories/temperature').TemperatureAccessory;
const PrecipitationAccessory = require('./accessories/precipitation').PrecipitationAccessory;
const PressureAccessory = require('./accessories/pressure').PressureAccessory;
// Wind yes/no accessory removed by request; keep numeric ones only
const WindSpeedAccessory = require('./accessories/windSpeed').WindSpeedAccessory;
const WindDirectionAccessory = require('./accessories/windDirection').WindDirectionAccessory;
const RadiationAccessory = require('./accessories/radiation').RadiationAccessory;

class WeatherXMPlatform {
  constructor(log, config = {}, api) {
    this.log = log;
    this.api = api;

    this.platformName = 'WeatherXM';
    this.name = config.name || 'WeatherXM';
    this.config = config;
    this.storagePath = (api && api.user && typeof api.user.storagePath === 'function')
      ? api.user.storagePath()
      : (process.env.HOMEBRIDGE_STORAGE_PATH || process.cwd());
    this.logger = new Logger(this.storagePath, 'weatherxm', log, config.logToFile !== false, config.debug || false);

    if (!config.apiKey) {
      this.logger.error('apiKey missing in plugin config. Plugin will be disabled.');
      return;
    }

    this.client = new WeatherXMApiClient({
      apiKey: config.apiKey,
      stationId: config.stationId,
      logger: this.logger,
      storagePath: this.storagePath
    });

  this.apiCallsPerMonth = Number(config.apiCallsPerMonth || 1000);
    this.accessories = []; // instances

    this.cachedData = null;
    this.lastFetchTs = 0;

  // determine interval based on remaining time in current month and allowed calls (pro‑rata)
  this._computeInterval();

    // Homebridge API objects
    this.Service = api.hap.Service;
    this.Characteristic = api.hap.Characteristic;
    this.platformAccessoryClass = api.platformAccessory;

    this.api = api;

    this.api.on('didFinishLaunching', () => {
      this._init().catch(err => this.logger.error('init error', err.message));
    });
  }

  _computeInterval() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based
    const startOfNextMonth = new Date(year, month + 1, 1, 0, 0, 0, 0);
    const startOfThisMonth = new Date(year, month, 1, 0, 0, 0, 0);
    const secondsInMonth = Math.floor((startOfNextMonth - startOfThisMonth) / 1000);
    const remainingSeconds = Math.max(1, Math.floor((startOfNextMonth - now) / 1000));
    const fractionRemaining = Math.min(1, Math.max(0, remainingSeconds / secondsInMonth));
    const cap = Math.max(1, this.apiCallsPerMonth);
    // pro‑rata: assumiamo che i token precedenti siano già stati usati
    let allowableCalls = Math.floor(cap * fractionRemaining);
    if (allowableCalls < 1) allowableCalls = 1; // garantisci almeno 1 chiamata nel mese rimanente
    const intervalSeconds = Math.ceil(remainingSeconds / allowableCalls);
    this.refreshIntervalSeconds = Math.max(1, intervalSeconds);
    const remainingHours = Math.round(remainingSeconds / 3600);
    this.logger.info(`Limite mensile API: ${cap}. Secondi nel mese: ${secondsInMonth}. Secondi rimanenti: ${remainingSeconds} (~${remainingHours}h).`
      + ` Chiamate pro‑rata disponibili: ${allowableCalls}. Intervallo calcolato: ${this.refreshIntervalSeconds}s`);
  }

  async _init() {
    if (!this.client.stationId) {
      this.logger.error('stationId mancante nella configurazione. Il plugin verrà disabilitato.');
      return;
    }

    // create accessories
    await this._createAccessories();

    // first fetch now
    await this._fetchAndUpdate();

    // schedule periodic fetch using computed interval
    setInterval(() => {
      this._fetchAndUpdate().catch(err => this.logger.error('Periodic fetch error: ' + err.message));
    }, this.refreshIntervalSeconds * 1000);
  }

  async _createAccessories() {
    // create accessory instances of each sensor
    try {
      this.temperature = new TemperatureAccessory(this, 'WeatherXM Temperature');
      this.precipitation = new PrecipitationAccessory(this, 'WeatherXM Precipitation');
      this.pressure = new PressureAccessory(this, 'WeatherXM Pressure');
  this.windSpeed = new WindSpeedAccessory(this, 'WeatherXM Wind Speed');
  this.windDirection = new WindDirectionAccessory(this, 'WeatherXM Wind Direction');
      this.radiation = new RadiationAccessory(this, 'WeatherXM Radiation');

      // store in list for update loops
      this.accessories = [
        this.temperature,
        this.precipitation,
        this.pressure,
        this.windSpeed,
        this.windDirection,
        this.radiation
      ];
    } catch (e) {
      this.logger.error('Error creating accessories: ' + e.message);
    }
  }

  async _fetchAndUpdate() {
    // rate-limit logic: check last fetch
    const now = Date.now();
    if (this.lastFetchTs && ((now - this.lastFetchTs) / 1000) < this.refreshIntervalSeconds) {
      const remaining = Math.round(this.refreshIntervalSeconds - ((now - this.lastFetchTs)/1000));
      const nextAt = new Date(this.lastFetchTs + this.refreshIntervalSeconds * 1000).toISOString();
      this.logger.debug('Skipping fetch to respect interval. Next allowed in', remaining, 's (at', nextAt, ')');
      return;
    }

    try {
      this.logger.info('Fetching latest data from WeatherXM for station', this.client.stationId);
      const data = await this.client.getLatestData();
      if (!data) {
        this.logger.warn('No data returned from API.');
        return;
      }
  this.lastFetchTs = Date.now();
      this.cachedData = data;
  const nextAt = new Date(this.lastFetchTs + this.refreshIntervalSeconds * 1000).toISOString();
  this.logger.info('Next API fetch scheduled at', nextAt);

      // update accessories
      for (const acc of this.accessories) {
        try {
          acc.updateData(data);
        } catch (e) {
          this.logger.error('Accessory update error: ' + e.message);
        }
      }
      this.logger.info('All accessories updated.');
    } catch (e) {
      this.logger.error('Fetch error:', e.message);
    }
  }

  // Called by Homebridge when accessories are requested for restore (not used here)
  configureAccessory(accessory) {
    // Implement if persistent accessories needed
    this.logger.debug('configureAccessory called for', accessory.displayName);
  }
}

module.exports = { WeatherXMPlatform };
