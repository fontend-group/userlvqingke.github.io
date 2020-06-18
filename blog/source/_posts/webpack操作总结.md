---
title: webpack操作总结
date: 2020-06-14 18:52:52
tags: ['javascript', 'webpack', '构建工具']
---
## 基础篇
1. 环境搭建

```
安装nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
安装nodejs 和 npm
nvm install v12.13.0
创建空目录和package.json
mkdir my-project
cd my-project/
npm init -y
安装webpack和webpack-cli
npm i webpack webpack-cli --save-dev
执行 ./node_modules/.bin/webpack -v 查看安装的webpack版本
```

2. 简单运行demo

```
创建webpack.config.js
const path = require('path');
module.exports =  {
    mode: 'production',
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    }
}

运行：./node_modules/.bin/webpack
默认执行webpack.config.js配置文件
```
3. 通过npm script 运行webpack

```
脚本呀
package.json能读取到node_modules/.bin/目录下的文件：
scripts: {
    "build": webpack
}
即可
```
4. entry 打包入口文件

```
单入口文件：
entry: path.join(__dirname, 'src/index') // 字符串
多入口文件：
entry: { 
    index: path.join(__dirname, 'src/index.js'),
    main: path.join(__dirname, 'src/main.js')
} // 对象
```
5. output 打包输出文件

```
output告诉webpack如何将编译后的文件输出到磁盘
output: {
    path: path.join(__dirname, 'dist'),
    filename: [name].js
}
[name] 占位符，确保文件名称统一，适用于多入口构建
```
6. loaders

```
webpack 开箱即用只支持js和json两种文件类型，通过loaders去支持将其他文件类型转为有效模块，并加入到依赖图中
loaders本身是函数，接受参数，返回转换结果
module: {
    rules: [{
            test: /\.css$/, // test指定匹配规则
            use: 'css-loader' // use指定使用的loader名称
        }]
}
```

名称 | 描述
---|---
babel-loader | 转换ES6及以后的新特性语法
css-loader | 支持.css文件的加载和解析
less-loader | 将less文件转换为css
ts-loader | 将TS转为JS
file-loader | 对图片、字体等的打包
raw-loader | 将文件以json形式导入
thread-loader | 多进程打包js和css

7. plugins

```
增强loader的功能，作用于整个构建过程
plugins: [
    new HtmlWebpackPlugin({
        template: './src/index.html'
    }) 
] // 所有的plugins 放到数组里

```

名称 | 描述
---|---
CommonsChunkPlugin | 将chunks相同的模块代码提取为公共js
CleanWebpackPlugin | 清理构建目录
ExtractTextWebpackPlugin | 将css从bundle文件里提取一个单独的css文件
CopyWebpackPlugin | 将文件或文件夹拷贝到输出目录
HtmlWebpackPlugin | 创建html文件，承载输出的bundle
UglifyjsWebpackPlugin | 压缩JS
ZipWebpackPlugin | 将打包出的资源生成一个zip包

8. mode

```
mode指定当前的构建环境：production、development、none
默认为production
```
mode内置函数的功能

选项 | 描述
---|---
development | 设置process.env.NODE_ENV的值为development，开启NamedChunksPlugin 和 NamedModulesPlugin
production | 设置process.env.NODE_ENV的值为production，开启...
none | 不开启任何优化项

9. 解析ES6

```
安装依赖
npm i babel-loader @babel/core @babel/preset-env --save-dev
创建.babelrc文件，内容：
{
    "presets": [
        "@babel/preset-env"
    ]
}
webpack.config.js中：
module: {
    rules: [{
        test: /\.js$/,
        use: 'babel-loader'
    }]
}
```
10. 解析css

```
css-loader 用于加载css文件，并且转换成commonjs对象，插入到js中
style-loader 将样式通过style标签，插入到head中
安装依赖 npm i style-loader css-loader --save-dev
webpack.config.js中：
module: {
    rules: [{ 
        test: /\.css/,
        use: ['style-loader', 'css-loader']
    }]
}
```
11. 解析less 、sass

```
less-loader 将less转为css
安装依赖 npm i less less-loader --save-dev
webpack.config.js中：
module: {
    rules: [{
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
    }]
}
```
12. 解析图片、字体

```
安装依赖 npm i file-loader --save-dev
webpack.config.js中
module: {
    rules: [{
        test: /\.(png|jpg|gif|jpeg)$/,
        use: 'file-loader'
    }, {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: 'file-loader'
    }]
}
```

```
还可以使用use-loader解析图片、字体，设置小资源自动base64
安装依赖 npm i url-loader --save-dev
webpack.config.js 中：
module: {
    rules: [{
        test: /\.(png|jpg|gif|jpeg)$/,
        use: [{
            loader: 'url-loader',
            options: {
                limit: 10240
            }
        }]
    }]
}
```
13. webpack文件监听

```
文件监听是在发现源码发生变化时，自动重新构建输出新的构建文件。
webpack开启文件监听到两种方式：
scripts: {
    build: webpack --watch
}
在配置文件webpack.config.js中添加watch: true
原理：
轮询判断文件最后编译时间是否发生变化
某个文件发生变化，并不会立刻告诉监听者，而是先缓存起来，等aggregateTimeout
webpack.config.js中：
module.exports = {
    watch: true, // 默认false，不开启监听
    watchOptions: {
        ignore: /node_modules/, // 默认为空，不监听的文件或文件夹，支持正则
        aggreateTimeout: 300, // 监听变化发生后300ms再去执行，默认300ms
        poll: 1000 // 判断文件是否发生变化，是通过不停询问系统指定文件是否发生变化，默认每秒1000次
    }
}
```
14. webpack热更新

```
使用webpack-dev-server
不刷新浏览器、不输出编译文件，而是放在内存里
webpack.config.js中：
module.exports = {
    mode: 'development',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        hot: true
    }
}
package.json中：
{
    scripts: {
        server: webpack-dev-server --open
    }
}
```

```
使用webpack-dev-middleware
wdm将webpack输出的文件传给服务端
直接上代码：
const express = require('express');
const webpack = require('webpack');
const WebpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.dev.js');
const compiler = webpack(config);

app.use(WebpackDevMiddleware(compiler, {
    publicPath: config.output.path
}))

app.listen(3000, function() {
    console.log('listen 3000');
})
```

原理：

```
webpack compiler 编译生成bundle.js
HMR Server 将热更新的文件传给 HMR Runtime
Bundle Server 提供文件浏览器访问
HMR Runtime 注入到浏览器的bundle.js中，跟新文件变化
bundle.js 构建输出的文件
```
<font color="#ff0000">此处缺少一张图 位置：/Users/aaa/Downloads/youdao-note-imgs</font>

15. 文件指纹

```
如何生成：
Hash: 和整个项目的构建有关，只有项目文件修改，整个项目构建的hash值就会更改
Chunkhash: 和webpack打包的chunk有关，不同的entry会生成不同的chunkhash值
Contenthash: 根据文件内容来定义hash，文件内容不变，则Contenthash不变
```

```
js文件指纹设置
webpack.config.js中：
mode: 'production',
output: {
    path: path.join(__dirname, 'dist'),
    filename: [name]_[chunkhash:8].js
}
```

```
css文件指纹设置：
安装依赖插件：npm i mini-css-extract-plugin --save-dev
webpack.config.js中
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
        }]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        })
    ]
}

```


```
图片、字体文件指纹设置：
webpack.config.js中：
module: {
    rules: [{
        test: /\.png|jpg|gif|jpeg$/,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name]_[hash:8].[ext]'
            }
        }
    }, {
        test: /\.woff|woff2|eot|ttf|otf$/,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name]_[hash:8].[ext]'
            }
        }
    }]
}
```

占位符 | 含义
---|---
[ext] | 资源后缀名
[name] | 文件名称
[path] | 文件相对路径
[folder] | 文件所在的文件夹
[contenthash] | 文件的内容hash，默认由md5生成
[hash] | 文件内容的hash，默认由md5生成
[emoji] | 一个随机的指代文件内容的emoji

16. js html css 文件压缩

```
js压缩
webpack4 内置了uglifyjs-webpack-plugin, mode为production时，自动执行压缩操作
```

```
html压缩
安装依赖插件：npm i html-webpack-plugin --save-dev
webpack.config.js中：
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),
            filename: 'index.html',
            chunks: [index],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCss: true,
                minifyJs: true,
                removeComments: false
            }
            
        })
    ]
}
```

```
css压缩
安装依赖 npm i optimize-css-assets-webpack-plugin cssnano --save-dev
webpack.config.js中：
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
    plugins: [
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', { discardComments: { removeAll: true } }]
            },
            canPrint: true
        })
    ]
}
```

## 进阶篇
1. 自动清理构建目录产物

```
通过package.json中的scripts清理
scripts: {
    build: rm -rf ./dist && webpack
}
```

```
通过插件 clean-webpack-plugin
安装依赖： npm i clean-webpack-plugin --save-dev
webpack.config.js中：
const CleanWebpackPlugin = require('clean-webpack-plugin');
module.exports = {
    plugins: [
        new CleanWebpackPlugin()
    ]
}
```
2. 自动补齐css3前缀

```
安装依赖 npm i postcss-loader autoprefixer --save-dev
webpack.config.js中
module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use ['style-loader', 'css-loader', {
                loader: 'postcss-loader',
                options: {
                    plugins: () => [require('autoprefixer')]
                }
            }]
        }]
    }
}
package.json中
{
    "browserslist": [
        "last 2 version",
        ">1%",
        "ios 7"
    ]
}
```
3. px自动转为css

```
通过使用px2rem-loader、lib-flexible
px2rem-loader: 将px转为rem
lib-flexible: 时时计算根元素字体大小
安装依赖 
npm i px2rem-loader --save-dev
npm i lib-flexible --save
webpack.config.js中
module.exports = {
    module: {
        rules: [{
            test: /\.css$/,
            use ['style-loader', 'css-loader', {
                loader: 'postcss-loader',
                options: {
                    plugins: () => [require('autoprefixer')]
                }
            }, {
                loader: 'px2rem-loader',
                options: {
                    remUni: 75,
                    remPricision: 8
                }
            }]
        }]
    }
}
```
4. 静态资源内联

```
依赖于raw-loader
意义：
代码层面：页面框架到初始化脚本；上报相关打点；css内联避免页面闪动
请求层面：减少HTTP网络请求

小图片或者字体内联，用url-loader
```
<font color="#ff0000">raw-loader 没有使用成功</font>
5. 多页面应用编译

```
通用方案：
动态获取entry和设置 html-webpack-plugin数量
依赖于 glob 
安装依赖 npm i glob --save-dev
具体遍历封装参考 https://github.com/userlvqingke/testEmpty webpack.pro.js

```
6. soucemap应用

```
webpack.config.js中
module.exports = {
    module: {
        devtool: 'souce-map' // 值有很多，相见webpack开发文档
    }
}
```
7. 提取页面公共资源

```
基础库分离

思路：将react、react-dom基础包通过cdn引入，不打入bundle.js中
使用 html-webpack-externals-plugin
```


```
webpack3中用到 CommonsChunkPlugin
webpack4中用到 SplitChunksPlugin

webpack.config.js中
module.exports = {
    optimization: {
        splitChunks: {
            minSize: 0 // 公共模块最小大小
            cacheGroups: {
                commons: {
                    name: 'commons',
                    chunks: 'all',
                    minChunks: 2 // 几处共用到
                }
            }
        }
    }
}
```
8. tree shaking(摇树优化)

```
概念：1个模块可能有很多方法，只要其中的某个方法使用到了，则整个文件都会被打到bundle里面去，tree shaking就是只把用到的方法打入bundle中，没有用到的方法会在uglify阶段被删除掉
使用：webpack默认支持，在.babelrc中设置modules: false即可
    mode: production 默认开启
要求必须是ES6语法
```
9. scope hoisting 原理

```
现象：构建后代码存在大量闭包代码
问题：大量函数闭包包裹代码，导致体积增大（模块越多越明显）
运行代码时，创建的函数作用域变多，内存开销变大

原理：将所有模块的代码按照引入顺序放在一个函数作用域，然后适当命名一些变量以防止变量名冲突
对比：通过scope hoisting可以减少函数声明代码和内存开销
```
10. 代码分割和动态import

```
懒加载js脚本的方式：
CommonJS: require.ensure
ES6:动态import（目前原生还没有支持，需要babel转换）

安装依赖插件：
npm i @babel/plugin-syntax-dynamic-import --save-dev
.babelrc中：
{
    plugins: ["plugin-syntax-dynamic-import"]
}
```
11. 在webpack中使用eslint

```
安装依赖:
npm i eslint-loader --save-dev
webpack.config.js中：
module.exports = {
    module: {
        rules: [{
            test: /\.js$/,
            use: 'eslint-loader'
        }]
    }
}
创建.eslint文件
"use strict";

module.exports = {
	root: true,
	env: {
		node: true,
		es6: true
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module'
	},
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly'
	},
	rules: {
		indent: ['error', 4],
		semi: ['off', "always"],
		"multiline-comment-style": ['off', "always"]
	},
	extends: [
		'standard'
	],
}
```

```
制定团队的ESLint规范
不重复造轮子，基于eslint:recommend进行改进
能够帮助发现代码错误的规则，全部开启
帮助团队保持代码风格的统一，而不是限制开发体验
```
12. webpack打包组件和基础库

```
参考 https://github.com/userlvqingke/-jacklv-js-demo
```
13. webpack 实现ssr打包

```
这个现在不做具体尝试
渲染：HTML + CSS + JS + Data -->渲染后的html
服务端：
    所有模版资源都存储在服务端
    内网机器拉取数据更快
    一个html返回所有数据

```

*** | 客户端渲染 | 服务端渲染
---|--- | ---
请求 | 多个请求（html和数据等） | 1个请求
加载过程 | html和数据串行加载 | 1个请求返回Html和数据
渲染 | 前端渲染 | 服务端渲染
可交互 | 图片等静态资源加载完毕，JS逻辑执行完成可交互

14.优化构建时命令行的显示日志

```
安装依赖插件：friendly-errors-webpack-plugin
npm i friendly-errors-webpack-plugin --save-dev
webpack.config.js中
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
module.exports = {
    plugins: [
        new FriendlyErrorsWebpackPlugin()
    ]
    stats: 'errors-only'
}

```
15. 构建异常和中断处理

```
构建完成后，输入echo $?获取错误码
webpack4之前的版本构建失败不会抛出错误码（error code）
Nodejs 中process.exit规范
  0标识成功，回调函数中err为null
  非0标识失败，回调函数中err不为null，err.code 是要传给exit的值
```

```
webpack.config.js中 webpack4
module.exports = {
    plugins: [
        function() {
            this.hook.done.tap('done', stats => {
                if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
                    console.log('build error')
                    process.exit(1)
                }
            })
        }
    ]
}
webpack.config.js中 webpack3
module.exports = {
    plugins: [
        function() {
            this.plugin('done', stats => {
                if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') == -1) {
                    console.log('build error')
                    process.exit(1)
                }
            })
        }
    ]
}
```
















































