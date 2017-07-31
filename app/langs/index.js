/**
 * langs
 */
const langs = [
    {
        "lang": "Korea",
        "code": "ko",
        "match": "Hangul" 
    },
    {
        "lang": "English",
        "code": "en",
        "match": /[a-zA-Z][a-zA-Z \t]*/
    },
    {
        "lang": "简体中文",
        "code": "zh-cn",
        "match": "Han" 
    }
];

function getLang(code) {
    for(let i=0; i<langs.length; i++) {
        if (langs[i].code == code) {
            return langs[i];
        }
    }

    return null;
}


module.exports = {
    langs,
    getLang
};

