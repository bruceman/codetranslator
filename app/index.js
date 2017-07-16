// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const path = require('path');
const electron = require('electron');
const dialog = electron.remote.dialog;
const langCodes = require('./lang-codes');
console.log(langCodes);

let uniqueId = 1;

function getUniqueId() {
  return uniqueId++;
}

var vm = new Vue({
  el: '#app',
  data: {
    transItems: [],
    selectedItem: null,
    transFolders: [],
    //current language code
    langCode: langCodes[0]
  },
  mounted: function () {
    Vue.nextTick(function () {
    })
  },
  methods: {
    openFolders: function () {
      dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']}, (filePaths)=>{
        if (filePaths) {
          filePaths.forEach(this.processFolder);
        }
      });
    },

    openFiles: function () {
      dialog.showOpenDialog({properties: ['openFile', 'multiSelections']}, (filePaths)=>{
        if (filePaths) {
          filePaths.forEach(this.processFile);
        }
      });
    },

    processFolder: function (filePath) {
      const index = filePath.lastIndexOf("/");
      const folderName = filePath.substr(index+1);
      this.transFolders.push({name: folderName, path: filePath, isDir: true, children: []});
    },

    processFile: function (filePath) {
      console.log('process file: ' + filePath);
      fs.readFile(filePath, 'utf8', (err, data) => {
        let ext = path.extname(filePath);
        if (ext.charAt(0) === '.') {
          ext = ext.substr(1);
        }
        this.transItems.push({id: getUniqueId(), name: path.basename(filePath), path: filePath, ext: ext, source: data, target: ''});
        const lastIndex = this.transItems.length - 1;
        this.selectItem(this.transItems[lastIndex], lastIndex);
        
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
      targetEditor.innerText = item.source;
      targetEditor.setAttribute("class", cssClass);

      Vue.nextTick(()=>{
        hljs.highlightBlock(sourceEditor);
        hljs.highlightBlock(targetEditor);
      });
    },

    closeItem: function (item) {
      const index = this.transItems.indexOf(item);
      this.transItems.splice(index,1);

      if (this.transItems.length > 0) {
        this.selectItem(this.transItems[0]);
      } else {
        this.selectedItem = null;
      }
    },

    clickFolder: function (item) {
      fs.readdir(item.path, (err, files)=>{
        //
        console.log(files);
      });
    }

  }

});

