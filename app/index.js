// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const path = require('path');
const electron = require('electron');
const dialog = electron.remote.dialog;
const folder = require('./folder');
const translation = require('./translation')
const configure = require('./util/configure');
const langModule = require('./langs');

//config dir path
const configPath = path.join(__dirname, '../conf');

let uniqueId = 1;

function getUniqueId() {
    return uniqueId++;
}

let transDetailsWindow = null;

var vm = new Vue({
    el: '#app',
    data: {
        translator: new translation.Translator(),
        transItems: [],
        selectedItem: null,
        transFolders: [],
        langs: langModule.langs,
        fromLang: configure.language.from,
        toLang: configure.language.to,
        showOriginal: true,
        showTranslated: true
    },
    mounted: function () {
        // todo
    },
    methods: {
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
            let transItem = this.findTransItem(filePath);
            //file has been opened
            if (transItem) {
                this.selectItem(transItem);
                return;
            }

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

        findTransItem: function(filePath) {
            let arr = this.transItems.filter(function(item) {
                return item.path == filePath;
            });

            return arr.length>0 ? arr[0] : null;
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

        translate: function () {
            if (this.selectedItem) {
                this.translateItem(this.selectedItem);
            }
        },

        translateItem: function (item) {
            if (!item.source) {
                return;
            }

            this.translator.translate(item.source, this.fromLang || '', this.toLang || 'en').then((result) => {
                item.target = result.target;
                item.details = result.details;
                console.log(result);
                
                if (this.selectedItem.id == item.id) {
                    const targetEditor = document.getElementById("targetEditor");
                    targetEditor.innerText = item.target || item.source;
                    hljs.highlightBlock(targetEditor);
                }
            });

        },

        refresh: function () {
            window.location.reload();
        },

        openTransDetails: function () {
            if (!this.selectedItem) {
                alert("there are no translated file");
                return;
            }

            // reuse the same window if possible
            if (!transDetailsWindow || transDetailsWindow.closed) {
                transDetailsWindow = window.open("trans-details.html");
            }

            transDetailsWindow.focus();
            
            setTimeout(() => {
                 transDetailsWindow.postMessage(this.selectedItem);
            }, 200);
           
        },

        openSettings: function () {
            let win = window.open("settings.html");
            console.log(win);
        }

    }

});

