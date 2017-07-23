
const engines = [
    {name: 'Custom Translate', value: 'custom'},
    {name: 'Google Translate', value: 'google'},
    {name: 'Bing Translate', value: 'bing'}
];

function getEngine(value) {
    for(let i=0; i<engines.length; i++) {
        if (engines[i].value == value) {
            return engines[i];
        }
    }

    return null;
}

module.exports = {
    engines,
    getEngine
};
