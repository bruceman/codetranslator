const fs = require('fs');

class PropertyParser {
    /**
     * Read java like property file and return key value object
     * 
     * @param {string} filePath 
     */
    read(filePath) {
        let content = fs.readFileSync(filePath, {encoding: 'utf8'});
        let lines = content.split(/[\r\n]+/) || [];
        let props = {};

        lines.forEach(function(line) {
            line = line.trim();
            //skip empty line and comment line
            if (!line || line.startsWith('#')) {
                return;
            }

            let sepIndex = line.indexOf('=');
            if (sepIndex > 0) {
                let key = line.substring(0, sepIndex);
                let value = line.substring(sepIndex+1);
                props[key] = value;
            }
        });

        return props;
    }

    write(filePath, props) {
        
    }
}

module.exports = new PropertyParser();
