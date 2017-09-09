/**
 * Utility methods to read configuaration in config.json
 * The config is sington, the data is sharing on different place.
 */
const configKey = Symbol.for('config');
const globalSymbols = Object.getOwnPropertySymbols(global);
const hasConfig = (globalSymbols.indexOf(configKey) > -1);

if (!hasConfig){
    global[configKey] = require('../../conf/config.json');
}

module.exports = {
    get config() {
        return global[configKey];
    },

    set config(newConfig) {
        global[configKey] = newConfig;
        console.log(newConfig);
    },

    get translation() {
        return this.config.translation
    },
    
    get language() {
        return this.config.language;
    },

    get engine() {
        return this.config.engine;
    }

 };