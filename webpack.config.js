const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
    mode: 'development',
    entry: {
      app: './src/app.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      // new CleanWebpackPlugin(),
        new HTMLWebpackPlugin({
            template: 'src/index.html',
    
       
        }),

      
    ],
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
              // Creates `style` nodes from JS strings
              "style-loader",
              // Translates CSS into CommonJS
              "css-loader",
              // Compiles Sass to CSS
              "sass-loader",
            ],
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
              {
                loader: 'file-loader',
                options: {
                  name: 'fonts/[name].[ext]',
                },
              },
            ],
          
      
          },
          {
            test: /\.(jpe?g|png|gif|svg)$/i,
            use:[
              {
                loader: 'file-loader',
                // type: "asset",
                options: {
                  name: '[name].[ext]',
                  outputPath: 'imgs/'
                }
              }
              
            ]
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ],

      },
    optimization: {
        runtimeChunk: 'single'
    },

}