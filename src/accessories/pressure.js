class PressureAccessory {
  constructor(platform, name) {
    this.platform = platform;
    this.log = platform.logger;
    this.name = name || 'WeatherXM Pressure';
    this.api = platform.api;
    const UUID = this.api.hap.uuid.generate(`weatherxm-pressure-${this.name}`);
    this.accessory = new this.platform.platformAccessoryClass(this.name, UUID);
    // Accessory Information (HAP compliance)
    try {
      const pkg = require('../../package.json');
      const info = this.accessory.getService(this.api.hap.Service.AccessoryInformation);
      info.setCharacteristic(this.api.hap.Characteristic.Manufacturer, 'Homebridge TC WeatherXM');
      info.setCharacteristic(this.api.hap.Characteristic.Model, 'WeatherXM Sensor');
      info.setCharacteristic(this.api.hap.Characteristic.SerialNumber, `${this.platform.client.stationId || 'unknown'}-pressure`);
      info.setCharacteristic(this.api.hap.Characteristic.FirmwareRevision, pkg.version || '0.0.0');
    } catch {}
    this.accessory.category = this.api.hap.Categories.SENSOR;
    // Use CarbonDioxideSensor to display a numeric value (ppm label in Home)
    this.service = this.accessory.getService(this.api.hap.Service.CarbonDioxideSensor) || this.accessory.addService(this.api.hap.Service.CarbonDioxideSensor, this.name);
    this.service.setCharacteristic(this.api.hap.Characteristic.CarbonDioxideDetected, this.api.hap.Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL);
    this.service.setCharacteristic(this.api.hap.Characteristic.CarbonDioxideLevel, 0);
    this.platform.api.registerPlatformAccessories('homebridge-weatherxm', 'WeatherXM', [this.accessory]);
    this.log.info('Pressure accessory created:', this.name, '(displayed as CO2 level due to HomeKit limitations)');
  }

  updateData(data) {
    const p = (data && data.pressure != null) ? Number(data.pressure) : (data && data.pressure_pa != null ? Number(data.pressure_pa) / 100 : null);
    if (p == null) {
      this.log.warn('Pressure null, skipping');
      return;
    }
    // Map hPa to CarbonDioxideLevel (ppm) just for numeric display; include real unit in logs/name
  // HomeKit CarbonDioxideLevel typical safe range: 0..100000
  const numeric = Math.max(0, Math.min(100000, p));
    this.service.updateCharacteristic(this.api.hap.Characteristic.CarbonDioxideLevel, numeric);
    // Optionally set detected if outside nominal range
    const abnormal = (p < 980 || p > 1040);
    this.service.updateCharacteristic(
      this.api.hap.Characteristic.CarbonDioxideDetected,
      abnormal ? this.api.hap.Characteristic.CarbonDioxideDetected.CO2_LEVELS_ABNORMAL : this.api.hap.Characteristic.CarbonDioxideDetected.CO2_LEVELS_NORMAL
    );
    this.log.info(`Pressure updated: ${p} hPa${abnormal ? ' (out of nominal range)' : ''}`);
  }
}

module.exports = { PressureAccessory };
