class WindSpeedAccessory {
  constructor(platform, name) {
    this.platform = platform;
    this.log = platform.logger;
    this.name = name || 'WeatherXM Wind Speed';
    this.api = platform.api;
    const UUID = this.api.hap.uuid.generate(`weatherxm-windspeed-${this.name}`);
    this.accessory = new this.platform.platformAccessoryClass(this.name, UUID);
    // Accessory Information (HAP compliance)
    try {
      const pkg = require('../../package.json');
      const info = this.accessory.getService(this.api.hap.Service.AccessoryInformation);
      info.setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'Homebridge TC WeatherXM');
      info.setCharacteristic(this.api.hap.Characteristic.Model, 'WeatherXM Sensor');
      info.setCharacteristic(this.api.hap.Characteristic.SerialNumber, `${this.platform.client.stationId || 'unknown'}-windspeed`);
      info.setCharacteristic(this.api.hap.Characteristic.FirmwareRevision, pkg.version || '0.0.0');
    } catch {}
    this.accessory.category = this.api.hap.Categories.SENSOR;
    // Use LightSensor to display a numeric value in Home (units shown as lux)
    this.service = this.accessory.getService(this.api.hap.Service.LightSensor) || this.accessory.addService(this.api.hap.Service.LightSensor, this.name);
    // HomeKit min for Ambient Light is 0.0001 lux
    this.service.setCharacteristic(this.api.hap.Characteristic.CurrentAmbientLightLevel, 0.0001);
    this.platform.api.registerPlatformAccessories('homebridge-weatherxm', 'WeatherXM', [this.accessory]);
    this.log.info('Wind Speed accessory created:', this.name, '(displayed on Light tile; value is m/s, unit label in Home is lux)');
  }

  updateData(data) {
    const speed = (data && data.wind_speed != null) ? Number(data.wind_speed) : null;
    if (speed == null || Number.isNaN(speed)) {
      this.log.warn('Wind speed null, skipping');
      return;
    }
    // Map m/s to Ambient Light Level for numeric display
    const clamped = Math.min(100000, Math.max(0.0001, speed));
    this.service.updateCharacteristic(this.api.hap.Characteristic.CurrentAmbientLightLevel, clamped);
    this.log.info(`Wind speed updated: ${speed} m/s (shown as Light level)`);
  }
}

module.exports = { WindSpeedAccessory };
