const fs = require('fs');
const path = require('path');

class Logger {
  constructor(homebridgeStoragePath, pluginName, hbLogFunc, enableFile = true, debug = false) {
    this.debugMode = !!debug;
    this.hbLog = hbLogFunc || console.log;
    this.pluginName = pluginName || 'weatherxm';
    this.fileEnabled = !!enableFile;
    this.logPath = null;

    if (this.fileEnabled) {
      try {
        const dir = path.resolve(homebridgeStoragePath || process.env.HOMEBRIDGE_CONFIG_UI || '.');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        this.logPath = path.join(dir, `${this.pluginName}.log`);
      } catch (e) {
        this.fileEnabled = false;
      }
    }
  }

  _writeFile(line) {
    if (!this.fileEnabled || !this.logPath) return;
    try {
      fs.appendFileSync(this.logPath, line + '\n');
    } catch (e) {
      // ignore file errors
    }
  }

  info(...args) {
    const line = `[INFO] ${new Date().toISOString()} - ${args.join(' ')}`;
    this.hbLog(line);
    this._writeFile(line);
  }
  warn(...args) {
    const line = `[WARN] ${new Date().toISOString()} - ${args.join(' ')}`;
    this.hbLog(line);
    this._writeFile(line);
  }
  error(...args) {
    const line = `[ERROR] ${new Date().toISOString()} - ${args.join(' ')}`;
    this.hbLog(line);
    this._writeFile(line);
  }
  debug(...args) {
    if (!this.debugMode) return;
    const line = `[DEBUG] ${new Date().toISOString()} - ${args.join(' ')}`;
    this.hbLog(line);
    this._writeFile(line);
  }
}

module.exports = { Logger };
