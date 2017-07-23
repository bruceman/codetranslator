const fs = require('fs');
const path = require('path');
const electron = require('electron');
const Translation = require('./translation')
const config = require('../conf/config.json');
const langModule = require('../conf/langs');
const propertyParser = require('./util/property-parser');
const translateEngine = require('./translation/engine');
const formatJson = require('format-json');

console.log(formatJson.plain(config));

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
        engines: translateEngine.engines,
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
            console.log(formatJson.plain(config));
            fs.writeFileSync(path.join(configPath, "config.json"), formatJson.plain(config));
        }
    }

});

