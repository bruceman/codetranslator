const fs = require('fs');
const path = require('path');
const Promise = require('promise');
const CustomEngine = require('./custom');
const GoogleEngine = require('./google');

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




class Translation {
    
    constructor(config) {
        this._config = config || {};
        this.setEngine(config.engine || 'custom');
    }

    setEngine(engine) {
        this._engine = engine;
    }

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
        let engines = engineModule.getEngines(this._engine);
        // no avaialbe engine
        if (!engines || engines.length === 0) {
            Promise.resolve(source);
            return;
        }

        return new Promise((resolve, reject) => {
            let index = 0;
            let through = function (result) {
                if (index == engines.length-1) {
                    resolve(result);
                } else {
                    engines[++index].translate(result, from, to).then(through);
                }
            };

            engines[0].translate(source, from, to).then(through);
        });
    }

} 




module.exports = Translation;