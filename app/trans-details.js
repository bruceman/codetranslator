const electron = require('electron');
const clipboard = electron.remote.clipboard

var vm = new Vue({
    el: '#app',
    data: {
        transItem: null
    },
    mounted: function () {
        window.addEventListener('message', (event) => {
            this.transItem = event.data;
        });
    },
    methods: {
        copy: function () {
            if (this.transItem && this.transItem.details) {
                let details = this.transItem.details;
                let result = [];
                for(let k in details) {
                    result.push(k + "=" + details[k]);
                }
                clipboard.writeText(result.join("\n"));
                alert("trnaslate details have been copied to the clipboard");
            }
        } 
    }

});

