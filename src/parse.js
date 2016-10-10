var _fs = require('fs');
var FILE_ENCODING = 'utf-8';

function uglifyjs(PATH){
    var files = _fs.readdirSync(PATH);
    var filesPath=[];
    files.forEach((file)=>{filesPath.push(PATH + file);});
    var uglifyjs= require("uglify-js");
    var u=uglifyjs.minify(filesPath);
    return u.code;
};

function concat(PATH){
     var files = _fs.readdirSync(PATH);
     var f = files.map(function (file) {
        var filePath = PATH + file;
        return _fs.readFileSync(filePath, FILE_ENCODING);
    });
    return  f.join('\n');
};

 _fs.writeFileSync('DOM.min.js',uglifyjs('./lib/'), FILE_ENCODING);


