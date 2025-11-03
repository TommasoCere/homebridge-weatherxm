const { v4: uuidv4 } = require('uuid');

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
    this.service.updateCharacteristic(this.api.hap.Characteristic.CurrentTemperature, t);
    this.log.info(`Temperature updated: ${t} °C`);
  }
}

module.exports = { TemperatureAccessory };
