'use strict';
var gutil = require('gulp-util');
var through = require('through2');
var fs = require('fs');
var PluginError = gutil.PluginError;

// 常量
const PLUGIN_NAME = 'gulp-automerge';
var defaultOptions = {
	prefixText: '',
	prefixApplyType: 'page',
	replaceExt: '.wxml',
	regexp:/<import [^>]*src=[\'\"][^\'\"]+?\/template\/(\w+)\.\w+[\'\"]\s*\/>/g,
	appendTpl: '@import "{relativePrefix}style/widget/{name}.scss";'
}
function prefixStream(prefixText) {
	var stream = through();
	stream.write(prefixText);
	return stream;
}
function extend(def, target){
	for(var k in defaultOptions){
		if(!target[k]){
			target[k] = defaultOptions[k];
		}
	}
	return target;
}
module.exports = function (options) {
	if(!options){
		options = {};
	}
	extend(defaultOptions, options);
	options.prefixApplyType = options.prefixApplyType.toLowerCase();
/*
	var prefixText = options.prefixText;

	if (!prefixText) {
		throw new PluginError(PLUGIN_NAME, 'Missing prefix text!');
	}
	prefixText = new Buffer(prefixText); // 预先分配
*/

	// 创建一个让每个文件通过的 stream 通道
	return through.obj(function(file, enc, cb) {
		//for(var k in file)
		//console.log([k,file[k]]);
		//console.log([file.relative,file.base,file.path])
		var relativePrefix = file.relative.replace(/([^\/]+)/g,'..').replace(/[^\/]+$/,'');
		var path = file.path.replace(/\.\w+$/,options.replaceExt);
		var appendContent = options.prefixText;
		if(fs.existsSync(path)){
			var fileContent = fs.readFileSync(path, 'utf8');
			var tpls = [];
			fileContent.replace(options.regexp,function($0,$1){
				if($1){
					if (tpls.indexOf($1) == -1){//去重
						tpls.push($1);
						appendContent += '\n' + options.appendTpl.replace('{name}', $1);
					}
				}
				return $0;
			});
			if(options.prefixApplyType == 'template' && !tpls.length){//追加内容仅应用到引入了模板的页面
				cb(null, file);
				return;
			}

		}else if(options.prefixApplyType != 'all'){
			cb(null, file);
			return;
		}

		if(appendContent){
			appendContent = appendContent.replace(/\{relativePrefix\}/g, relativePrefix);
			appendContent = new Buffer(appendContent + '\n'); // 预先分配

/*			if (file.isNull()) {
				// 返回空文件
				cb(null, file);
			}*/
			if (file.isBuffer()) {
				file.contents = Buffer.concat([appendContent, file.contents]);
			}
			if (file.isStream()) {
				file.contents = file.contents.pipe(prefixStream(appendContent));
			}
		}

		cb(null, file);

	});

};
