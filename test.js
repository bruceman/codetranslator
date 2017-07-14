const translate = require('google-translate-api');
const XRegExp = require('xregexp');

translate('함께 구매하면 좋은 상품', {to: 'en'}).then(res => {
    console.log(res.text);
    //=> I speak English
    console.log(res.from.language.iso);
    //=> nl
}).catch(err => {
    console.error(err);
});

function isKorea(str, len) {
    if (typeof str !== 'string' || str.length === 0) {
        return false;
    }
    if (!len || len < 0 || len > str.length) {
        len = str.length;
    }
    for (let i = 0; i < len; i++) {
        let c = str.charCodeAt(i);
        if (c < 0xAC00 || c > 0xD7A3) {
            return false;
        }
    }
    return true;
}

console.log(isKorea('isKorea'))
console.log(isKorea('함께좋은'))

// const re = /[\u3131-\uD79D]/ugi
// console.log("abcde".match(re)) // null
// console.log("안녕".match(re)) // ["안", "녕"]

const xregex = XRegExp('^\\p{Hangul}+$')
console.log(xregex.test('abc'));
console.log(xregex.test('함께좋은'));
