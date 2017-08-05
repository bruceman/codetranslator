const fs = require('fs');
const path = require('path');
const Promise = require('promise');
const CustomEngine = require('./engines/custom');
const GoogleEngine = require('./engines/google');
const configure = require('../util/configure');

/**
 * all avaiable translate engines
 */
const engines = [
    {name: 'Custom Translate', value: 'custom'},
    {name: 'Google Translate', value: 'google'},
    {name: 'Cusotm + Google Translate', value: 'custom,google'}
];

const engineMap = {
    'custom': CustomEngine,
    'google': GoogleEngine
};


class Translator {
    /**
     * Get engines for given value
     *
     * @return array of engine class
     */
    _getEngines(value) {
        if (!value) {
            return null;
        }

        return value.split(',').map(function (item) {
            return new engineMap[item]();
        });
    }


    translate(source, from , to) {
        let engines = this._getEngines(configure.engine);
        // no avaialbe engine
        if (!engines || engines.length === 0) {
            Promise.resolve({source:source, target: source, details: []});
            return;
        }

        return new Promise((resolve, reject) => {
            let index = 0;
            let details = {};
            let through = function (result) {
                // concat details
                Object.assign(details, result.details);

                if (index == engines.length-1) {
                    resolve({source: source, target: result.target, details: details});
                } else {
                    engines[++index].translate(result.target, from, to).then(through);
                }
            };

            //trigger first translate engine to run
            engines[0].translate(source, from, to).then(through);
        });
    }

} 

module.exports = {
    Translator,
    engines
};