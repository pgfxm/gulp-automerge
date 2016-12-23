# gulp-automerge 

*该插件主要是为了给小程序项目实现template样式自动引入到相应页面.*


## Install

```
$ npm install --save-dev gulp-automerge
```


## Usage

```js
const gulp = require('gulp');
const automerge = require('gulp-automerge');

gulp.task('default', () =>
	gulp.src('src/*.wxss')
		.pipe(automerge({}))
		.pipe(gulp.dest('dist'))
);
```

## Options

There are 8 options:

* `prefixText` (string): 默认追加到文件头的内容，默认值为空
* `replaceExt` (string): 引入template文件的后缀名，默认为'.wxml'
* `regexp` (regexp): 匹配模板名的正常表达式，默认为：/<import [^>]*src=[\'\"][^\'\"]+?\/template\/(\w+)\.\w+[\'\"]\s*\/>/g.
* `appendTpl` (string): 引入template 样式的模板字串，默认为：'@import "{relativePrefix}style/widget/{name}.scss";'
* `isPrefixApplyToAll`(boolean): true:prefixText应用于所有匹配到的文件，false:prefixText仅应用于有对应replaceExt文件的文件，默认为false
* prefixText和appendTpl里可以用{relativePrefix}来取代相对路径
## Tip

你可以在小程序里的项目引用该插件，他能帮你自动引入模板样式


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
