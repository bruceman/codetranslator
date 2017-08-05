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
            let target = source;
            let result = {source: source, target: target, details:[]};

            if (this._customTranslation) {
                for(let k in this._customTranslation) {
                    let v = this._customTranslation[k];
                    // save translated items
                    if (target.indexOf(k) >= 0) {
                        result.details[k] = v;
                    }

                    target = target.replace(k, v);
                }

                result.target = target;
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

