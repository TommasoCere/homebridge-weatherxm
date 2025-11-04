class RadiationAccessory {
  constructor(platform, name) {
    this.platform = platform;
    this.log = platform.logger;
    this.name = name || 'WeatherXM Radiation';
    this.api = platform.api;
    const UUID = this.api.hap.uuid.generate(`weatherxm-radiation-${this.name}`);
    this.accessory = new this.platform.platformAccessoryClass(this.name, UUID);
    // Accessory Information (HAP compliance)
    try {
      const pkg = require('../../package.json');
      const info = this.accessory.getService(this.api.hap.Service.AccessoryInformation);
      info.setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'Homebridge WeatherXM');
      info.setCharacteristic(this.api.hap.Characteristic.Model, 'WeatherXM Sensor');
      info.setCharacteristic(this.api.hap.Characteristic.SerialNumber, `${this.platform.client.stationId || 'unknown'}-radiation`);
      info.setCharacteristic(this.api.hap.Characteristic.FirmwareRevision, pkg.version || '0.0.0');
    } catch {}
    this.accessory.category = this.api.hap.Categories.SENSOR;
    // use LightSensor for solar radiation (lux-like value)
  this.service = this.accessory.getService(this.api.hap.Service.LightSensor) || this.accessory.addService(this.api.hap.Service.LightSensor, this.name);
  // HomeKit min for Ambient Light is 0.0001 lux
  this.service.setCharacteristic(this.api.hap.Characteristic.CurrentAmbientLightLevel, 0.0001);
    this.platform.api.registerPlatformAccessories('homebridge-weatherxm', 'WeatherXM', [this.accessory]);
    this.log.info('Radiation accessory created:', this.name);
  }

  updateData(data) {
    const raw = data
      ? (data.solar_radiation != null
        ? data.solar_radiation
        : (data.radiation != null ? data.radiation : null))
      : null;
    const rad = raw != null ? Number(raw) : null;
    if (rad == null || Number.isNaN(rad)) {
      this.log.warn('Radiation null, skipping');
      return;
    }
  // HomeKit Ambient Light Level range: 0.0001..100000 lux
  const clamped = Math.min(100000, Math.max(0.0001, rad));
    this.service.updateCharacteristic(this.api.hap.Characteristic.CurrentAmbientLightLevel, clamped);
    this.log.info(`Radiation updated: ${rad}`);
  }
}

module.exports = { RadiationAccessory };
