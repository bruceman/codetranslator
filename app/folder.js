const fs = require('fs');
const path = require('path');


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
                    'attrs': {
                        'title': item.name
                    },
                    'on': {
                        'click': this.clickHandler(item)
                    }
                },
                [ 
                    createElement (
                        'i',
                        {
                            'class': 'icon ' + (!item.isDir ? 'icon-doc-text' : (item.expand ? 'icon-archive' : 'icon-folder'))
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
        let self = this;
        return function () {
            if (item.isDir) {
                if (!item.expand) {
                    self.expandFolder(item);
                }
            } else {
                self.$emit("selectfile", item);
            }
        }
    },

    expandFolder: function (item) {
        item.expand = true;

        fs.readdir(item.path, (err, files) => {
            if (!files || files.length === 0) {
                return;
            }

            let children = [];

            files.forEach(function (file) {
                let filePath = path.join(item.path, file);
                let isDir = fs.lstatSync(filePath).isDirectory();
                children.push({ name: file, path: filePath, isDir: isDir, expand: false, children: []});
            });

            item.children = children;
        });
    }

  }
});
