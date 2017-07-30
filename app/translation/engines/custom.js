const Promise = require('promise');
const configure = require('../../util/configure');
const propertyEditor = require('../../util/property-editor');
// custom translation folder path
const translationPath = path.join(__dirname, '../../../conf/translation');

/**
 * Translate engine using custom translation rules
 */
class CustomEngine {
    /**
     * constructor
     */
    constructor() {
        const apply = configure.translation.apply;
        
        if (apply && apply.length>0) {
            const filePaths = apply.map(function (file) {
                return path.join(translationPath, file);
            });

            this.setCustomTranslation(this._readCustomTranslation(filePaths));
        }
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

    /**
     * read custom translation data from files
     * 
     * @param {array} filePaths 
     */
    _readCustomTranslation(filePaths) {
        const customTranslation = {};

        filePaths.forEach(function (filePath) {
            let props = propertyEditor.read(filePath);
            Object.assign(customTranslation, props);
        });

        return customTranslation;
    }
}

module.exports = CustomEngine;

