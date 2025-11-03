class WindAccessory {
  constructor(platform, name) {
    this.platform = platform;
    this.log = platform.logger;
    this.name = name || 'WeatherXM Wind';
    this.api = platform.api;
    const UUID = this.api.hap.uuid.generate(`weatherxm-wind-${this.name}`);
    this.accessory = new this.platform.platformAccessoryClass(this.name, UUID);
    // Use MotionSensor for a distinct icon; triggers when wind exceeds a threshold
    this.service = this.accessory.getService(this.api.hap.Service.MotionSensor) || this.accessory.addService(this.api.hap.Service.MotionSensor, this.name);
    this.service.setCharacteristic(this.api.hap.Characteristic.MotionDetected, false);
    this.threshold = 0.3; // m/s default threshold
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
    const detected = speed >= this.threshold;
    this.service.updateCharacteristic(this.api.hap.Characteristic.MotionDetected, detected);
    this.log.info(`Wind updated: ${speed} m/s${dir != null ? `, direction ${dir}°` : ''} (threshold ${this.threshold} m/s)`);
  }
}

module.exports = { WindAccessory };
