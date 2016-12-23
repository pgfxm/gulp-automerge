# gulp-automerge 

*该插件主要实现给匹配文件头部追加一段内容,是为了在自己的小程序项目更方便的引入template，而写的一个分析页面引入的template文件，实现自动在当前页面样式里引入相应template的样式，前提是每个template有同名的独立样式文件.除了引入template的样式，还可以给所有匹配页面追加公共样式，这个在项目里用sass时优为有用*


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
		.pipe(automerge({
		    prefixText: '@import "{relativePrefix}style/base/_variables.scss"; @import "{relativePrefix}style/base/_mixin.scss"; @import "{relativePrefix}style/base/_animation.scss"; @import "{relativePrefix}style/base/_reset.scss";',
		    replaceExt: '.wxml',
		    regexp:/<import [^>]*src=[\'\"][^\'\"]+?\/template\/(\w+)\.\w+[\'\"]\s*\/>/g,
		    appendTpl: '@import "{relativePrefix}style/widget/{name}.scss";'
		}))
		.pipe(gulp.dest('dist'))
);
```
详细使用范例可看下面的Tip。
## Options

There are 8 options:

* `prefixText` (string): 默认追加到文件头部的内容，默认值为空
* `replaceExt` (string): 匹配wxss对应的page文件的后缀名，默认为'.wxml'
* `regexp` (regexp): 匹配模板名的正常表达式，默认为：/<import [^>]*src=[\'\"][^\'\"]+?\/template\/(\w+)\.\w+[\'\"]\s*\/>/g.我的模板是放在项目src/template/里
* `appendTpl` (string): 引入template 样式的模板字串，默认为：'@import "{relativePrefix}style/widget/{name}.scss";'，{relativePrefix}是代表引入样式的相对路径，{name}是代表对应的template名
* `prefixApplyType`(string): all:prefixText应用于所有匹配到的文件，page:prefixText仅应用于当前文件有对应page页面（即replaceExt扩展名文件）的文件，template:prefixText仅应用于当前文件对应的page文件内容能匹配regexp的文件。默认为page
* prefixText和appendTpl里可以用{relativePrefix}来取代相对路径
## Tip

你可以在小程序里的项目引用该插件，经过适当调整目录结构和保持每个template有独立文件和独立样式，他能帮你自动引入页面引用的template样式以及每个页面公共的样式。
以下是我小程序的目录结构。
```
|-- pages
|   |-- index
|   |   |-- index.js
|   |   |-- index.json
|   |   |-- index.wxml
|   |   |-- index.wxss
|   |-- member
|   |   |-- index
|   |   |   |-- index.js
|   |   |   |-- index.json
|   |   |   |-- index.wxml
|   |   |   |-- index.wxss
|-- style
|   |-- base
|   |   |-- _animation.scss
|   |   |-- _mixin.scss
|   |   |-- _reset.scss
|   |   |-- _variables.scss
|   |-- widget
|   |   |-- toast.scss
|-- template
|   |-- toast.wxml
|-- utils
|   |-- fileCache.js
|   |-- formVerify.js
|   |-- util.js
|-- app.js
|-- app.json
|-- app.wxss
```
*其中template下的toast.wxml对应的样式是style/widget/toast.scss,即template文件都放在template/文件夹下，其对应的样式都在style/widget/文件夹的同名文件里
我相应的gulp task如下*

```js
gulp.task('sasscss', function () {
    gulp.src([srcPath + '**/*.*ss','!'+srcPath+'style/**/*.*ss'])
        .on('error', function (err) {
            console.error('Error!', err.message);
        })
        .pipe(automerge({
            prefixText: '@import "{relativePrefix}style/base/_variables.scss"; @import "{relativePrefix}style/base/_mixin.scss"; @import "{relativePrefix}style/base/_animation.scss"; @import "{relativePrefix}style/base/_reset.scss";',
            replaceExt: '.wxml',
            regexp:/<import [^>]*src=[\'\"][^\'\"]+?\/template\/(\w+)\.\w+[\'\"]\s*\/>/g,
            appendTpl: '@import "{relativePrefix}style/widget/{name}.scss";'
        }))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename({
            extname: ".wxss"
        }))
        .pipe(gulp.dest(distPath))
})
```
## License

MIT © [pgfxm](https://github.com/pgfxm)
