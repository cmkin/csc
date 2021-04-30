const path = require('path')
const webpack = require('webpack')




const resolve = dir => {
	return path.join(__dirname, dir)
}



module.exports = {

	pluginOptions: {
		'style-resources-loader': {
			preProcessor: 'less',
			patterns: [
				//path.resolve(__dirname, './src/assets/less/global.less')
			]
		}
	},

	css: {
		loaderOptions: {
			less: {
				// 若使用 less-loader@5，请移除 lessOptions 这一级，直接配置选项。
				lessOptions: {
					modifyVars: {
						// 直接覆盖变量

						// 或者可以通过 less 文件覆盖（文件路径为绝对路径）
						//hack: `true; @import "./src/assets/less/global.less";`,
					},
				},
			},
		},
	},


	publicPath: './',
	// tweak internal webpack configuration.
	// see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
	// 如果你不需要使用eslint，把lintOnSave设为false即可
	lintOnSave: false,
	chainWebpack: config => {
		config.resolve.alias
			.set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
		//.set('_c', resolve('src/components'))
		//.set('_v', resolve('src/view'))
		//.set('_a', resolve('src/assets'))
	},
	// 设为false打包时不生成.map文件
	productionSourceMap: false,
	// 这里写你调用接口的基础路径，来解决跨域，如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
	devServer: {
		https: false,
		proxy: {
			'tz': {
				target: 'https://pc.qf2802.com/',
				ws: false,
				changeOrigin: true,
				pathRewrite: {
					'^/tz': ''
				}
			},
			'yc': {
				target: 'https://28xiaomi.com/',
				ws: false,
				changeOrigin: true,
				pathRewrite: {
					'^/yc': ''
				}
			},

		},
		//proxy: 'https://fanyi-api.baidu.com/',
	}

}
