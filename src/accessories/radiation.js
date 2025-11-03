class RadiationAccessory {
  constructor(platform, name) {
    this.platform = platform;
    this.log = platform.logger;
    this.name = name || 'WeatherXM Radiation';
    this.api = platform.api;
    const UUID = this.api.hap.uuid.generate(`weatherxm-radiation-${this.name}`);
    this.accessory = new this.platform.platformAccessoryClass(this.name, UUID);
    // use LightSensor for solar radiation (lux-like value)
  this.service = this.accessory.getService(this.api.hap.Service.LightSensor) || this.accessory.addService(this.api.hap.Service.LightSensor, this.name);
  // HomeKit min for Ambient Light is 0.0001 lux
  this.service.setCharacteristic(this.api.hap.Characteristic.CurrentAmbientLightLevel, 0.0001);
    this.platform.api.registerPlatformAccessories('homebridge-weatherxm', 'WeatherXM', [this.accessory]);
    this.log.info('Radiation accessory created:', this.name);
  }

  updateData(data) {
    const rad = (data && (data.solar_radiation != null ? data.solar_radiation : data.radiation)) ? Number(data.solar_radiation != null ? data.solar_radiation : data.radiation) : null;
    if (rad == null) {
      this.log.warn('Radiation null, skipping');
      return;
    }
    const clamped = Math.max(0.0001, rad);
    this.service.updateCharacteristic(this.api.hap.Characteristic.CurrentAmbientLightLevel, clamped);
    this.log.info(`Radiation updated: ${rad}`);
  }
}

module.exports = { RadiationAccessory };
