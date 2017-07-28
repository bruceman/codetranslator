const Promise = require('promise');

/**
 * Translate engine using custom translation rules
 */
class CustomEngine {
    /**
     * constructor
     */
    constructor(customTranslation) {
        this.setCustomTranslation(customTranslation);
    }

    /**
     * cusotm translation object
     * 
     * example: {key1:value1, key2:value2}
     * 
     * @param {object} customTranslation
     */
    setCustomTranslation(customTranslation) {
        this._customTranslation = customTranslation || {};
    }

    /**
     * translate source string using custom translation rules
     */
    translate(source, from, to) {
        // return promise
        return new Promise((resolve, reject) => {
            let result = source;

            if (this._customTranslation) {
                for(let k in this._customTranslation) {
                    result = result.replace(k, this._customTranslation[k]);
                }

                console.log(result);
            }

            resolve(result);

        });
    }
}

module.exports = CustomEngine;

