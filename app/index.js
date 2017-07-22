// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const path = require('path');
const electron = require('electron');
const dialog = electron.remote.dialog;
const langCodes = require('./lang-codes');
const folder = require('./folder');
const Translation = require('./translation')
const config = require('../conf/config.json');
const propertyParser = require('./util/property-parser');


//config dir path
const configPath = path.join(__dirname, '../conf');

let uniqueId = 1;

function getUniqueId() {
    return uniqueId++;
}

var vm = new Vue({
    el: '#app',
    data: {
        translation: new Translation(),
        transItems: [],
        selectedItem: null,
        transFolders: [],
        //current language code
        langCode: langCodes[0]
    },
    mounted: function () {
        this.initTranslation(config.translation);
        Vue.nextTick(function () {
        })
    },
    methods: {
        initTranslation: function (options) {
            let customTranslation = null;
            if (options.apply && options.apply.length > 0) {
                let basePath = path.join(configPath, 'translation');
                let filePaths = options.apply.map(function (file) {
                    return path.join(basePath, file);
                });
                customTranslation = this.readyCustomTranslation(filePaths);
            }
            this.translation = new Translation(customTranslation);

        },

        readyCustomTranslation: function (filePaths) {
            console.log(filePaths);
            let customTranslation = {};
            filePaths.forEach(function (filePath) {
                let props = propertyParser.read(filePath);
                Object.assign(customTranslation, props);
            });
            console.log(customTranslation);
            return customTranslation;
        },

        openFolders: function () {
            dialog.showOpenDialog({ properties: ['openDirectory', 'multiSelections'] }, (filePaths) => {
                if (filePaths) {
                    filePaths.forEach(this.processFolder);
                }
            });
        },

        openFiles: function () {
            dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] }, (filePaths) => {
                if (filePaths) {
                    filePaths.forEach(this.processFile);
                }
            });
        },

        processFolder: function (filePath) {
            const index = filePath.lastIndexOf("/");
            const folderName = filePath.substr(index + 1);
            this.transFolders.push({ name: folderName, path: filePath, isDir: true, children: [] });
        },

        processFile: function (filePath) {
            console.log('process file: ' + filePath);
            fs.readFile(filePath, 'utf8', (err, data) => {
                let ext = path.extname(filePath);
                if (ext.charAt(0) === '.') {
                    ext = ext.substr(1);
                }

                this.transItems.push({
                    id: getUniqueId(), name: path.basename(filePath), path: filePath, ext: ext,
                    source: data, target: ''
                });

                const lastIndex = this.transItems.length - 1;
                this.selectItem(this.transItems[lastIndex]);

            });
        },

        selectItem: function (item) {
            if (this.selectedItem && this.selectedItem.id == item.id) {
                return;
            }

            this.selectedItem = item;

            let cssClass = "hljs";
            if (item.ext) {
                cssClass += " " + item.ext;
            }

            const sourceEditor = document.getElementById("sourceEditor");
            sourceEditor.innerText = item.source;
            sourceEditor.setAttribute("class", cssClass);
            const targetEditor = document.getElementById("targetEditor");
            if (item.target) {
                //translated
                targetEditor.innerText = item.target;
            } else {
                targetEditor.innerText = 'translating...';
                this.translateItem(item);
            }

            targetEditor.setAttribute("class", cssClass);

            Vue.nextTick(() => {
                hljs.highlightBlock(sourceEditor);
                hljs.highlightBlock(targetEditor);
            });

        },

        closeItem: function (item) {
            const index = this.transItems.indexOf(item);
            this.transItems.splice(index, 1);

            if (this.transItems.length > 0) {
                this.selectItem(this.transItems[0]);
            } else {
                this.selectedItem = null;
            }
        },

        selectFileHandler: function (item) {
            this.processFile(item.path);
        },

        translateItem: function (item) {
            if (!item.source) {
                return;
            }

            this.translation.translate(item.source, '', 'en').then((result) => {
                item.target = result;
                if (this.selectedItem.id == item.id) {
                    const targetEditor = document.getElementById("targetEditor");
                    targetEditor.innerText = result || item.source;
                    hljs.highlightBlock(targetEditor);
                }
            });

        },

        showPopup: function () {
            let win = window.open("popup.html");
            console.log(win);
        }

    }

});

