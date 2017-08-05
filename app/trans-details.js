const fs = require('fs');
const path = require('path');
const electron = require('electron');
const translation = require('./translation')
const langModule = require('./langs');
const config = require('../conf/config.json');
const propertyEditor = require('./util/property-editor');


//config dir path
const configPath = path.join(__dirname, '../conf');
const transDir = path.join(configPath, 'translation')
const extension = config.translation.extension || '.txt';
const applyTranslation = config.translation.apply || [];

var vm = new Vue({
    el: '#app',
    data: {
        details: ""
    },
    mounted: function () {
        var self = this;
        window.addEventListener('message', function(event) {
            console.log(event.data)
        });
    },
    methods: {
    }

});

