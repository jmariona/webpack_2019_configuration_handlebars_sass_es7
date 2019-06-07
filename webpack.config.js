const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const autoprefixer = require("autoprefixer");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const _optionsWebpackLoader = {
	bypassOnDebug: true,
	disable: true,
	mozjpeg: {
		progressive: true,
		quality: 65,
	},

	optipng: {
		enabled: true,
	},

	pngquant: {
		quality: "65-90",
		speed: 4,
	},

	gifsicle: {
		interlaced: false,
	},
	webp: {
		quality: 75,
	},
};

const watch = true;
const mode = "development";

const entry = {
	index: ["./src/js/build.js", "./src/sass/build.scss"],
};

const output = {
	path: path.join(__dirname, "./dist"),
	filename: "./js/bundle.js",
};

const _optionsHandlebars = {
	helperDirs: [__dirname, "./src/js/helpers"],
};

const _optionsFileLoader = {
	name: "[name].[ext]",
	outputPath: "img/",
	publicPath: "../img",
};

const _module = {
	rules: [
		{
			test: /\.m?js$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: "babel-loader",
				options: {
					presets: ["@babel/preset-env"],
				},
			},
		},

		{
			test: /\.scss$/,
			exclude: /node_modules/,
			use: [
				"style-loader",
				MiniCssExtractPlugin.loader,
				"css-loader",
				"postcss-loader",
				"resolve-url-loader",
				"sass-loader",
			],
		},

		{
			test: /\.handlebars$/,
			use: [
				{
					loader: "handlebars-loader",
					options: _optionsHandlebars,
				},
			],
		},

		{
			test: /\.(gif|png|jpe?g|svg)$/i,
			use: [
				{
					loader: "file-loader",
					options: _optionsFileLoader,
				},

				{
					loader: "image-webpack-loader",
					options: _optionsWebpackLoader,
				},
			],
		},
	],
};

//Load Templates Arrays
const template = ["contact", "about"];

//Function print templates
const entryHtmlPlugins = template.map((tpl) => {
	return new HtmlWebpackPlugin({
		template: path.join(__dirname, `/src/templates/views/${tpl}.handlebars`),
		filename: tpl + ".html",
		minify: {
			collapseWhitespace: true,
			removeComments: true,
			removeRedundantAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			useShortDoctype: true,
		},
	});
});
//-----------------------------------------------------------------------------------------------------------------------//

const plugins = [
	new webpack.LoaderOptionsPlugin({
		options: {
			postcss: [autoprefixer()],
		},
	}),

	new MiniCssExtractPlugin({
		filename: "/css/bundle.css",
	}),

	new BrowserSyncPlugin({
		host: "localhost",
		port: 4000,
		server: {
			baseDir: ["dist"],
		},
	}),

	new HtmlWebpackPlugin({
		template: path.join(__dirname, "/src/templates/index.handlebars"),
		filename: "index.html",
		minify: {
			collapseWhitespace: true,
			removeComments: true,
			removeRedundantAttributes: true,
			removeScriptTypeAttributes: true,
			removeStyleLinkTypeAttributes: true,
			useShortDoctype: true,
		},
	}),

	new CleanWebpackPlugin({
		dry: true,
		cleanStaleWebpackAssets: false,
	}),
].concat(entryHtmlPlugins);

module.exports = {
	mode,
	entry,
	output,
	module: _module,
	plugins,
	watch,
};
