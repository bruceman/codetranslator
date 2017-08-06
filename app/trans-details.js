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
        transItem: null,
        formatedDetails: ""
    },
    mounted: function () {
        window.addEventListener('message', (event) => {
            this.transItem = event.data;
            this.formatDetails = this.formatDetails(this.transItem.details);
            console.log(event.data);
        });
    },
    methods: {
        formatDetails: function(details) {
            if (!details) {
                return "";
            }

            let result = [];
            for(let k in details) {
                result.push(k + "=" + details[k]);
            }

            return result.join("\n");
        }
    }

});

