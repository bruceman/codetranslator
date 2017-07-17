const fs = require('fs');

Vue.component('folder', {
  render: function (createElement) {
    return this.createNode(createElement, this.item, 0);
  },
  props: ['item'],
  methods: {
    createNode: function (createElement, item, level) {
        return createElement(
        'div',
        {
            'class': 'folder',
        },
        [ 
            createElement (
                'span',
                {
                    'class': 'nav-group-item',
                    'style': {
                        'paddingLeft': (25 + 10 * level) + 'px'
                    },
                    'on': {
                        'click': this.clickHandler(item)
                    }
                },
                [ 
                    createElement (
                        'i',
                        {
                            'class': 'icon ' + (item.isDir ? 'icon-folder' : 'icon-doc-text')
                        }
                    ),
                    item.name
                ]
            ),
            item.children.length > 0 ? item.children.map((child) => {
                return this.createNode(createElement, child, level+1);
            }) : null
        ]
        );
    },

     clickHandler: function (item) {
        return function () {
            console.log(item);
        }
        // fs.readdir(this.item.path, (err, files)=>{
        //     console.log(files);
        // });
        // console.log(item)
    }

  }
});
