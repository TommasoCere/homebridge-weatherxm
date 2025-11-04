class WindDirectionAccessory {
  constructor(platform, name) {
    this.platform = platform;
    this.log = platform.logger;
    this.name = name || 'WeatherXM Wind Direction';
    this.api = platform.api;
    const UUID = this.api.hap.uuid.generate(`weatherxm-winddir-${this.name}`);
    this.accessory = new this.platform.platformAccessoryClass(this.name, UUID);
    // Accessory Information (HAP compliance)
    try {
      const pkg = require('../../package.json');
      const info = this.accessory.getService(this.api.hap.Service.AccessoryInformation);
      info.setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'Homebridge TC WeatherXM');
      info.setCharacteristic(this.api.hap.Characteristic.Model, 'WeatherXM Sensor');
      info.setCharacteristic(this.api.hap.Characteristic.SerialNumber, `${this.platform.client.stationId || 'unknown'}-winddirection`);
      info.setCharacteristic(this.api.hap.Characteristic.FirmwareRevision, pkg.version || '0.0.0');
    } catch {}
    this.accessory.category = this.api.hap.Categories.SENSOR;
    // Use LightSensor to display a numeric value in Home (units shown as lux)
    this.service = this.accessory.getService(this.api.hap.Service.LightSensor) || this.accessory.addService(this.api.hap.Service.LightSensor, this.name);
    // HomeKit min for Ambient Light is 0.0001 lux
    this.service.setCharacteristic(this.api.hap.Characteristic.CurrentAmbientLightLevel, 0.0001);
    this.platform.api.registerPlatformAccessories('homebridge-weatherxm', 'WeatherXM', [this.accessory]);
    this.log.info('Wind Direction accessory created:', this.name, '(displayed on Light tile; value is degrees, unit label in Home is lux)');
  }

  updateData(data) {
    const dir = (data && data.wind_direction != null) ? Number(data.wind_direction) : null;
    if (dir == null || Number.isNaN(dir)) {
      this.log.warn('Wind direction null, skipping');
      return;
    }
    // Map degrees [0..360] to Ambient Light Level for numeric display
    let value = dir;
    if (value <= 0) value = 0.0001; // respect HomeKit min
    const clamped = Math.min(100000, Math.max(0.0001, value));
    this.service.updateCharacteristic(this.api.hap.Characteristic.CurrentAmbientLightLevel, clamped);
    this.log.info(`Wind direction updated: ${dir}° (shown as Light level)`);
  }
}

module.exports = { WindDirectionAccessory };
