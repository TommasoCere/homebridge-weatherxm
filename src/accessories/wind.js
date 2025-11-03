class WindAccessory {
  constructor(platform, name) {
    this.platform = platform;
    this.log = platform.logger;
    this.name = name || 'WeatherXM Wind';
    this.api = platform.api;
    const UUID = this.api.hap.uuid.generate(`weatherxm-wind-${this.name}`);
    this.accessory = new this.platform.platformAccessoryClass(this.name, UUID);
    // use LightSensor to display numeric wind speed
    this.service = this.accessory.getService(this.api.hap.Service.LightSensor) || this.accessory.addService(this.api.hap.Service.LightSensor, this.name);
    this.service.setCharacteristic(this.api.hap.Characteristic.CurrentAmbientLightLevel, 0);
    this.platform.api.registerPlatformAccessories('homebridge-weatherxm', 'WeatherXM', [this.accessory]);
    this.log.info('Wind accessory created:', this.name);
  }

  updateData(data) {
    const speed = (data && data.wind_speed != null) ? Number(data.wind_speed) : null;
    const dir = (data && data.wind_direction != null) ? Number(data.wind_direction) : null;
    if (speed == null) {
      this.log.warn('Wind speed null, skipping');
      return;
    }
    // set wind speed (m/s or km/h depending on your API; leave raw)
    try {
      this.service.updateCharacteristic(this.api.hap.Characteristic.CurrentAmbientLightLevel, speed);
    } catch (e) {
      this.log.warn('Failed to update wind characteristic', e.message);
    }
    // log direction as info (HomeKit has no direct wind direction characteristic)
    this.log.info(`Wind updated: ${speed} (direction ${dir}°)`);
  }
}

module.exports = { WindAccessory };
