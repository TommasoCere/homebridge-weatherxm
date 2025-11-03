class PressureAccessory {
  constructor(platform, name) {
    this.platform = platform;
    this.log = platform.logger;
    this.name = name || 'WeatherXM Pressure';
    this.api = platform.api;
    const UUID = this.api.hap.uuid.generate(`weatherxm-pressure-${this.name}`);
    this.accessory = new this.platform.platformAccessoryClass(this.name, UUID);
    // use TemperatureSensor as generic numeric sensor with custom label, or use AirPressure (not native) so we use TemperatureSensor but name is Pressure
    this.service = this.accessory.getService(this.api.hap.Service.TemperatureSensor) || this.accessory.addService(this.api.hap.Service.TemperatureSensor, this.name);
    // store pressure in CurrentTemperature characteristic but labeled as pressure in the accessory name
    this.service.setCharacteristic(this.api.hap.Characteristic.CurrentTemperature, 1013);
    this.platform.api.registerPlatformAccessories('homebridge-weatherxm', 'WeatherXM', [this.accessory]);
    this.log.info('Pressure accessory created:', this.name);
  }

  updateData(data) {
    const p = (data && data.pressure != null) ? Number(data.pressure) : (data && data.pressure_pa != null ? Number(data.pressure_pa) / 100 : null);
    if (p == null) {
      this.log.warn('Pressure null, skipping');
      return;
    }
    // set in hPa mapped to CurrentTemperature characteristic (display name "Pressure")
    this.service.updateCharacteristic(this.api.hap.Characteristic.CurrentTemperature, p);
    this.log.info(`Pressure updated: ${p} hPa`);
  }
}

module.exports = { PressureAccessory };
