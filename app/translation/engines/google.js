const XRegExp = require('xregexp');
const Promise = require('promise');
const googleTranslate = require('google-translate-api');
const langModule = require('../../langs');

const DELIMITER = "\n";

class GoogleEngine {
    /**
     * translate string using google translate service
     * 
     * @param {string} source  
     * @param {string} from - the language code of original language
     * @param {stirng} to - the language code of target language
     */
    translate(source, from, to) {
        // return promise
        return new Promise((resolve, reject) => {
            let result = source;

            let transItems = this._collectTrnasItems(result, from);
            // no translation
            if (transItems.length === 0) {
                resolve(result);
                return;
            }

            this._translateItems(transItems, from, to).then(() => {
                for (var i = transItems.length - 1; i >= 0; i--) {
                    let item = transItems[i];
                    result = this._spliceString(result, item.index, item.text.length, item.result || item.text);
                }
                resolve(result);

            }, (err) => {
                console.err(err);
                reject(err);
            });

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

            let transtr = items.join(DELIMITER);
            console.log(transtr);

            googleTranslate(transtr, {from, to}).then(res => {
                console.log(res.text);
                let results = res.text.split(DELIMITER);
                results.forEach(function (result, index) {
                    transItems[index].result = result.trim();
                });
                resolve(transItems);

            }).catch(err => {
                reject(err);
            });
        });
        
    }

    _collectTrnasItems(source, from) {
        let lang = langModule.getLang(from);

        if (!lang) {
            return [];
        }

        let match = lang.match;
        let regex = null;
        //regex exporess
        if (match instanceof RegExp) {
            regex = XRegExp(match.source);
        } else {
            //string
            regex = XRegExp(`\\p{${match}}[\\p{${match}}|\\s]*`, "u");
        }

        let transItems = [];

        XRegExp.forEach(source, regex, function (obj) {
            transItems.push({text: obj[0].trim(), index: obj.index, result:''});
        });

        return transItems;
    }

}

module.exports = GoogleEngine;