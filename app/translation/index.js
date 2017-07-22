const fs = require('fs');
const path = require('path');
const XRegExp = require('xregexp');
const translateApi = require('google-translate-api');
const Promise = require('promise');



const regexTransItem = XRegExp('\\p{Han}[\\p{Han}|\\s]*', "u");
const itemDelimiter = ' ||| ';

class Translation {
    constructor(customTranslation) {
        this.setCustomTranslation(customTranslation);
        console.log('translation init...');
        console.log(this._customTranslation);
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
     * translate string 
     * 
     * @param {string} source  
     * @param {string} from 
     * @param {stirng} to 
     */
    translate(source, from, to) {
        // return promise
        return new Promise((resolve, reject) => {
            let result = source;

            if (this._customTranslation) {
                // replace custom translation firstly
                for(let k in this._customTranslation) {
                    debugger;
                    result = result.replace(k, this._customTranslation[k]);
                    resolve(result); // remove these
                    return;
                }
            }

            let transItems = this._collectTrnasItems(result);
            // no translation
            if (transItems.length === 0) {
                resolve(result);
                return;
            }

            this._translateItems(transItems, from, to).then(function () {
                for (var i = transItems.length - 1; i >= 0; i--) {
                    let item = transItems[i];
                    result = this.spliceString(result, item.index, item.text.length, item.result);
                }
                resolve(result);

            }).fail(function(err) {
                reject(err);
            })

        });
    }

    //splice('hello,123', 2, 3, '456') => 'he456,123'
    _spliceString(str, start, length, replace) {
      const before = str.substring(0, start);
      const after = str.substring(start+length);
      return before + replace + after;
    }

    _translateItems(transItems, from, to) {
        return new Promise((resolve, reject) => {
            let items = transItems.map(function (item) {
                return item.text;
            });

            let transtr = items.join(itemDelimiter);
            console.log(transtr);

            translateApi(transtr, {from, to}).then(res => {
                console.log(res.text);
                let results = res.text.split(itemDelimiter);
                results.forEach(function (result, index) {
                    transItems[index].result = result.trim();
                });
                resolve(transItems);

            }).catch(err => {
                reject(err);
            });
        });
        
    }

    _collectTrnasItems(source) {
        let transItems = [];

        XRegExp.forEach(source, regexTransItem, function (obj) {
            transItems.push({text: obj[0].trim(), index: obj.index, result:''});
        });

        return transItems;
    }
}




module.exports = Translation;