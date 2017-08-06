var vm = new Vue({
    el: '#app',
    data: {
        transItem: null,
        formatedDetails: ""
    },
    mounted: function () {
        window.addEventListener('message', (event) => {
            this.transItem = event.data;
            this.formatedDetails = this.formatDetails(this.transItem.details);
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

