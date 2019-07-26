var path = require('path')
var webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require("vue-loader")

module.exports = {
	mode: process.env.NODE_ENV,
	entry: {
		main: './src/App/Main/js/index.js',
	},
	output: {
		path: path.resolve(__dirname, './public'),
		publicPath: '/ARM/PLAN/MONTH_GRAF/JS/MON_GRAF_APP/public/',
		filename: './dist/[name].js'
	},
	plugins:[
		new VueLoaderPlugin(),
		new CopyPlugin([
			{ from: 'src/assets/js/helpers/functions.js', to: 'dist' },
			{ from: 'src/App/Main/index.html', to: 'main.html' },//надо будет сделать так, что бы он сам определял структуру и ключевые файлы
		]),
	],
	optimization: {
		minimize: process.env.NODE_ENV === 'production'?true:false,
	},
	module: {
		rules: [ {
			test: /\.css$/,
			use: [
			'vue-style-loader',
			'css-loader'
			],
		},{
			resourceQuery: /blockType=i18n/,
			type: 'javascript/auto',
			loader: '@kazupon/vue-i18n-loader'
		},{
			test: /\.scss$/,
			use: [
			'vue-style-loader',
			'css-loader',
			'sass-loader'
			],
		},{
			test: /\.sass$/,
			use: [
			'vue-style-loader',
			'css-loader',
			'sass-loader?indentedSyntax'
			],
		},{
			test: /\.vue$/,
			loader: 'vue-loader',
			options: {
				loaders: {
					// Since sass-loader (weirdly) has SCSS as its default parse mode, we map
					// the "scss" and "sass" values for the lang attribute to the right configs here.
					// other preprocessors should work out of the box, no loader config like this necessary.
					'scss': [
						'vue-style-loader',
						'css-loader',
						'sass-loader'
					],
					'sass': [
						'vue-style-loader',
						'css-loader',
						'sass-loader?indentedSyntax'
					]
				}
			// other vue-loader options go here
			}
		},	{
			test: /\.js$/,
			loader: 'babel-loader',
			exclude: /node_modules/
		},	{
			test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
			loader: 'file-loader',
  			options: {
				name: '[name].[ext]?[hash]'
			}
		}
		]
	},
	resolve: {
		alias: {
			'vue$': 'vue/dist/vue.esm.js'
		},
		extensions: ['*', '.js', '.vue', '.json']
	},
	devServer: {
		historyApiFallback: true,
		noInfo: true,
		overlay: true
	},
	performance: {
		hints: false
	},
	devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = '#source-map'
	// http://vue-loader.vuejs.org/en/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.LoaderOptionsPlugin({
			minimize: true
		})
	])
}
