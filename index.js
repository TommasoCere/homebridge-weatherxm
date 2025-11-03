module.exports = (api) => {
  api.registerPlatform('homebridge-weatherxm', require('./src/weatherxmPlatform').WeatherXMPlatform);
};
