class PressureAccessory {
  constructor(platform, name) {
    this.platform = platform;
    this.log = platform.logger;
    this.name = name || 'WeatherXM Pressure';
    this.api = platform.api;
    const UUID = this.api.hap.uuid.generate(`weatherxm-pressure-${this.name}`);
    this.accessory = new this.platform.platformAccessoryClass(this.name, UUID);
  // Use LightSensor to display numeric pressure avoiding Temperature 100°C limit
  this.service = this.accessory.getService(this.api.hap.Service.LightSensor) || this.accessory.addService(this.api.hap.Service.LightSensor, this.name);
  // Ambient Light Level must be >= 0.0001
  this.service.setCharacteristic(this.api.hap.Characteristic.CurrentAmbientLightLevel, 0.0001);
    this.platform.api.registerPlatformAccessories('homebridge-weatherxm', 'WeatherXM', [this.accessory]);
    this.log.info('Pressure accessory created:', this.name);
  }

  updateData(data) {
    const p = (data && data.pressure != null) ? Number(data.pressure) : (data && data.pressure_pa != null ? Number(data.pressure_pa) / 100 : null);
    if (p == null) {
      this.log.warn('Pressure null, skipping');
      return;
    }
  // show hPa as numeric value in AmbientLight characteristic (UI workaround)
  const clamped = Math.max(0.0001, p);
  this.service.updateCharacteristic(this.api.hap.Characteristic.CurrentAmbientLightLevel, clamped);
  this.log.info(`Pressure updated: ${p} hPa`);
  }
}

module.exports = { PressureAccessory };
