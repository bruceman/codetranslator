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
        "match": /[a-zA-Z]+/
    },
    {
        "lang": "简体中文",
        "code": "zh-cn",
        "match": "Han" 
    }
];

function getLang(name) {
    for(let i=0; i<langs.length; i++) {
        if (langs[i].lang == name) {
            return langs[i];
        }
    }

    return null;
}


module.exports = {
    langs,
    getLang
};

