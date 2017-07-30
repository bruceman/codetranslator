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
        transFiles: [],
        langs: langModule.langs,
        fromLang: config.language.from,
        toLang: config.language.to,
        engines: translation.engines,
        defaultEngine: config.engine
    },
    mounted: function () {
        this.getCustomTranslation();
        window.onbeforeunload = (e) => { 
            this.saveChanges();
        }
    },
    methods: {
        getCustomTranslation: function() {
            fs.readdir(transDir, (err, files) => {
                if (!files || files.length === 0) {
                    return;
                }

                files.forEach((file) => {
                    let ext = path.extname(file);
                    if (ext == extension) {
                        this.transFiles.push({name: file, path: path.join(transDir, file), checked: applyTranslation.indexOf(file) >= 0});
                    }
                });
                console.log(this.transFiles);
            });
        },

        saveChanges: function () {
            let applyFiles = this.transFiles.filter(function(item) {
                return item.checked;
            }).map(function (item2) {
                return item2.name;
            });
            config.translation.apply = applyFiles;
            config.language.from = this.fromLang;
            config.language.to = this.toLang;
            config.engine = this.defaultEngine;
            propertyEditor.write(path.join(configPath, "config.json"), config);
        }
    }

});

