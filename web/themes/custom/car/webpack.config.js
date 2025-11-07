const globImporter = require("node-sass-glob-importer");
const path = require("path");

// Use local node modules from the theme calling this file.
const relativeRequire = (name) => require(path.resolve(process.cwd(), `node_modules/${name}`));

const { CleanWebpackPlugin } = relativeRequire('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const DrupalLibrariesPlugin = relativeRequire('drupal-libraries-webpack-plugin');
// const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const RemoveEmptyScriptsPlugin = relativeRequire('webpack-remove-empty-scripts');
const glob = relativeRequire('glob');

let designSystemVersion = '0.0.1'

const tailwindStyles = {
  tailwind: './tailwind.css'
}

const styles = glob.sync('./{src/css,css}/**/*.css').reduce((all, name) => {
  const nameParts = name.split('/')
  const entryName = nameParts[nameParts.length - 1]
  const [fileName] = entryName.split('.')

  return {
    ...all,
    [fileName]: [`./${name}`]
  }
}, {})

const scripts = glob.sync('./{src/js,js}/**/*.js').reduce((all, name) => {
  const nameParts = name.split('/')
  const entryName = nameParts[nameParts.length - 1]
  const [fileName] = entryName.split('.')

  return {
    ...all,
    [`js/${fileName}`]: [`./${name}`]
  }
}, {})


module.exports = (env) => {
  const themeName = env.theme || 'car'
  //const baseLibrariesFileName = path.join(process.cwd(), `${themeName}.base.libraries.yml`)
  //const librariesFileName = path.join(process.cwd(), `${themeName}.libraries.yml`)
   
  return {
    entry: {
      ...tailwindStyles,
      ...scripts,
      ...styles,
    },
    output: {
      path: path.resolve(process.cwd(), 'dist')
    },
    resolve: {
      modules: [
      path.resolve(process.cwd(), 'node_modules'),
      ],
    extensions: ['.js', '.jsx', '.css', '.scss'],
    },
    optimization: {
      minimize: true,
      minimizer: [
        (compiler) => {
          const TerserPlugin = require('terser-webpack-plugin');
          new TerserPlugin({
            terserOptions: {
              compress: true,
            }
          }).apply(compiler);
        },
      ]

    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [/node_modules/],
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
                cacheCompression: false,
                cacheDirectory: true
              }
            }
          ]
        },
        {
          test: /\.css$/,
          exclude: /tailwind.css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            {
              loader: 'file-loader',
              options: {
                name: 'css/[name].[ext]',
                esModule: false
              }
            },
            'postcss-loader'
          ]
        },
        {
          test: /tailwind.css$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                esModule: false,
                emit: true
              }
            },
            'postcss-loader'
          ]
        },
      ]
    },

    plugins: [
      new CleanWebpackPlugin(),
      new RemoveEmptyScriptsPlugin(),
      new MiniCssExtractPlugin(),
      new CompressionPlugin({
        test: /\.js?$/i
      }),
    ]

  }
}
