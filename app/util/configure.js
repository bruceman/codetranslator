const config = require('../../conf/config.json');

/**
 * Utility methods to read configuaration in config.json
 */
module.exports = {
    get translation() {
        return config.translation
    },
    
    get language() {
        return config.language;
    },

    get engine() {
        return config.engine;
    }

 };