class PrecipitationAccessory {
  constructor(platform, name) {
    this.platform = platform;
    this.log = platform.logger;
    this.name = name || 'WeatherXM Precipitation';
    this.api = platform.api;
    const UUID = this.api.hap.uuid.generate(`weatherxm-precip-${this.name}`);
    this.accessory = new this.platform.platformAccessoryClass(this.name, UUID);
    // Accessory Information (HAP compliance)
    try {
      const pkg = require('../../package.json');
      const info = this.accessory.getService(this.api.hap.Service.AccessoryInformation);
      info.setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'Homebridge TC WeatherXM');
      info.setCharacteristic(this.api.hap.Characteristic.Model, 'WeatherXM Sensor');
      info.setCharacteristic(this.api.hap.Characteristic.SerialNumber, `${this.platform.client.stationId || 'unknown'}-precipitation`);
      info.setCharacteristic(this.api.hap.Characteristic.FirmwareRevision, pkg.version || '0.0.0');
    } catch {}
    this.accessory.category = this.api.hap.Categories.SENSOR;
    // Use LeakSensor to represent rain presence with a suitable icon in Home app
    this.service = this.accessory.getService(this.api.hap.Service.LeakSensor) ||
      this.accessory.addService(this.api.hap.Service.LeakSensor, this.name);
    this.service.setCharacteristic(this.api.hap.Characteristic.LeakDetected, this.api.hap.Characteristic.LeakDetected.LEAK_NOT_DETECTED);
    this.platform.api.registerPlatformAccessories('homebridge-weatherxm', 'WeatherXM', [this.accessory]);
    this.log.info('Precipitation accessory created:', this.name);
  }

  updateData(data) {
    // Use precipitation_rate (mm/h) to decide if it's raining now
    const rate = (data && data.precipitation_rate != null) ? Number(data.precipitation_rate) : null;
    const accum = (data && data.precipitation_accumulated != null) ? Number(data.precipitation_accumulated) : null;
    if (rate == null && accum == null) {
      this.log.warn('Precipitation data null, skipping');
      return;
    }
    const raining = (rate != null ? rate > 0 : false);
    this.service.updateCharacteristic(
      this.api.hap.Characteristic.LeakDetected,
      raining ? this.api.hap.Characteristic.LeakDetected.LEAK_DETECTED : this.api.hap.Characteristic.LeakDetected.LEAK_NOT_DETECTED
    );
    if (rate != null) this.log.info(`Precipitation rate: ${rate} mm/h${accum != null ? `, accumulated: ${accum} mm` : ''}`);
    else if (accum != null) this.log.info(`Precipitation accumulated counter: ${accum} mm`);
  }
}

module.exports = { PrecipitationAccessory };
