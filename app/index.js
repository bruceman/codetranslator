// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const fs = require('fs');
const electron = require('electron');
const dialog = electron.remote.dialog;


var vm = new Vue({
  el: '#app',
  data: {
    transItems: [
      {title: "Java in Action", source: 'english', target: '英文'}
    ],
    selectedItem: {},
    selectedIndex: 0
  },
  mounted: function () {
    Vue.nextTick(function () {
    })
  },
  methods: {
    openFolders: function () {
      dialog.showOpenDialog({properties: ['openDirectory', 'multiSelections']}, (filePaths)=>{
        console.log(filePaths);
      });
    },

    openFiles: function () {
      dialog.showOpenDialog({properties: ['openFile', 'multiSelections']}, (filePaths)=>{
        if (filePaths) {
          filePaths.forEach(this.processFile);
        }
      });
    },

    processFile: function (filePath) {
      console.log('process file: ' + filePath);
      fs.readFile(filePath, 'utf8', (err, data) => {
        this.transItems.push({title: filePath, source: data, target: ''});
        const lastIndex = this.transItems.length - 1;
        this.selectItem(this.transItems[lastIndex], lastIndex);
        
      });
    },

    selectItem: function (item, index) {
      if (index == this.selectedIndex) {
        return;
      }

      this.selectedItem = item;
      this.selectedIndex = index;
      
      let cssClass = "hljs";
      const sourceEditor = document.getElementById("sourceEditor");
      sourceEditor.innerText = item.source;
      const targetEditor = document.getElementById("targetEditor");
      targetEditor.innerText = item.source;
      // hljs.highlightBlock(sourceEditor);

      Vue.nextTick(()=>{
        hljs.highlightBlock(sourceEditor);
        hljs.highlightBlock(targetEditor);
        // console.log(sourceEditor.innerText)
      });
      // setTimeout(()=>{
      //   alert("sfsf")
      //   hljs.highlightBlock(document.getElementById("sourceEditor"));
      // },100)
    }

  }

});

