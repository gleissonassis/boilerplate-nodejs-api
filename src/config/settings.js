var merge     = require('deepmerge');

var commonSettings = {};
var privateSettings = {};
var settingsByEnv = {};

var env = (process.env.NODE_ENV || 'dev').toLowerCase();

console.log('boilerplate is running on ' + env);

try {
  console.log('Trying to read the common settings file');
  commonSettings = require('./settings.common');
  console.log('Common settings file read successfully');
} catch (e) {
  console.log('There is no common settings file to read');
}

try {
  console.log('Trying to read the private settings file');
  privateSettings = require('./settings.private');
  console.log('Private settings file read successfully');
} catch (e) {
  console.log('There is no private settings file to read');
}

try {
  console.log('Trying to read the DEV settings file');
  settingsByEnv.dev = require('./settings.dev');
  console.log('DEV settings file read successfully');
} catch (e) {
  console.log('There is no dev settings file to read');
}

try {
  console.log('Trying to read the PRD settings file');
  settingsByEnv.production = require('./settings.production');
  console.log('PRD settings file read successfully');
} catch (e) {
  console.log('There is no PRD settings file');
}

try {
  console.log('Trying to read the TEST settings file');
  settingsByEnv.test = require('./settings.test');
  console.log('TEST settings file read successfully');
} catch (e) {
  console.log('There is no TEST settings file');
}

var envinromentConfig = {};

if (settingsByEnv[env]) {
  envinromentConfig = settingsByEnv[env];
}

// merging common settings with private settings
var defaultConfig = merge(commonSettings, privateSettings);

// now merging default config with specifc enviroment config
defaultConfig = merge(defaultConfig, envinromentConfig);

console.log('boilerplate is running using this configurations ', defaultConfig);

module.exports = defaultConfig;
