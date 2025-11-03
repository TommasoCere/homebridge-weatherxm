class PrecipitationAccessory {
  constructor(platform, name) {
    this.platform = platform;
    this.log = platform.logger;
    this.name = name || 'WeatherXM Precipitation';
    this.api = platform.api;
    const UUID = this.api.hap.uuid.generate(`weatherxm-precip-${this.name}`);
    this.accessory = new this.platform.platformAccessoryClass(this.name, UUID);
    // use HumiditySensor to show numeric mm value as workaround
    this.service = this.accessory.getService(this.api.hap.Service.HumidifierDehumidifier) ||
      this.accessory.addService(this.api.hap.Service.HumidifierDehumidifier, this.name);
    // We'll map current relative humidity to precipitation mm by using a custom characteristic update in the "Active" field and CurrentRelativeHumidity as storage.
    this.service.getCharacteristic(this.api.hap.Characteristic.CurrentRelativeHumidity)
      .setProps({ minValue: -10000, maxValue: 100000 }); // allow wide range
    this.service.setCharacteristic(this.api.hap.Characteristic.CurrentRelativeHumidity, 0);
    this.platform.api.registerPlatformAccessories('homebridge-weatherxm', 'WeatherXM', [this.accessory]);
    this.log.info('Precipitation accessory created:', this.name);
  }

  updateData(data) {
    // data.precipitation_daily might be 'precipitation_daily' or similar
    const val = (data && (data.precipitation_daily != null ? data.precipitation_daily : data.precipitation)) ? Number(data.precipitation_daily != null ? data.precipitation_daily : data.precipitation) : null;
    if (val == null) {
      this.log.warn('Precipitation null, skipping');
      return;
    }
    // update the CurrentRelativeHumidity with mm value (workaround)
    this.service.updateCharacteristic(this.api.hap.Characteristic.CurrentRelativeHumidity, val);
    this.log.info(`Precipitation updated: ${val} mm (daily)`);
  }
}

module.exports = { PrecipitationAccessory };
