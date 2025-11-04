
class TemperatureAccessory {
  constructor(platform, name) {
    this.platform = platform;
    this.log = platform.logger;
    this.name = name || 'WeatherXM Temperature';
    this.api = platform.api;
    const UUID = this.api.hap.uuid.generate(`weatherxm-temp-${this.name}`);
    this.accessory = new this.platform.platformAccessoryClass(this.name, UUID);
    this.service = this.accessory.getService(this.api.hap.Service.TemperatureSensor) || this.accessory.addService(this.api.hap.Service.TemperatureSensor, this.name);
    // initial value (safe)
    this.service.setCharacteristic(this.api.hap.Characteristic.CurrentTemperature, 0);
    // register accessory
    this.platform.api.registerPlatformAccessories('homebridge-weatherxm', 'WeatherXM', [this.accessory]);
    this.log.info('Temperature accessory created:', this.name);
  }

  updateData(data) {
    // assume data.temperature is in °C
    const t = (data && data.temperature != null) ? Number(data.temperature) : null;
    if (t == null) {
      this.log.warn('Temperature value null, skipping update');
      return;
    }
    // HomeKit range: -273.15 to 100
    const clamped = Math.min(100, Math.max(-273.15, t));
    if (clamped !== t) this.log.warn(`Temperature clamped to HomeKit range: ${t} -> ${clamped}`);
    this.service.updateCharacteristic(this.api.hap.Characteristic.CurrentTemperature, clamped);
    this.log.info(`Temperature updated: ${clamped} °C`);
  }
}

module.exports = { TemperatureAccessory };
