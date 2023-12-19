const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');


module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: 'src/index.html'
        }),
      //  new CleanWebpackPlugin()
      
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
                options: {
                  name: '[name].[ext]',
                  outputPath: 'imgs/'
                }
              }
              
            ]
          }
        ],

      },

}