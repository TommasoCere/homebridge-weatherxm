module.exports = (api) => {
  // The first argument must match the "pluginAlias" in config.schema.json ("WeatherXM")
  api.registerPlatform('WeatherXM', require('./src/weatherxmPlatform').WeatherXMPlatform);
};
