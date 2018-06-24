var ExtractTextPlugin = require('extract-text-webpack-plugin')

var isProduction = process.env.NODE_ENV === 'production'

var cssLoaders = function (options) {
  options = options || {}

  var cssLoader = {
    loader: require.resolve('css-loader'),
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap,
      importLoaders: 1,
    }
  }

  var postCssLoader = {
    loader: require.resolve('postcss-loader'),
    options: {
      // Necessary for external CSS imports to work
      sourceMap: options.sourceMap,
      ident: 'postcss',
      plugins: () => [
        require('postcss-flexbugs-fixes'),
        autoprefixer({
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9', // Vue doesn't support IE8 anyway
          ],
          // flexbox: 'no-2009',
        }),
      ],
    },
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    var loaders = [cssLoader, postCssLoader]
    if (loader) {
      loaders.push({
        loader: require.resolve(loader + '-loader'),
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: require.resolve('vue-style-loader')
      })
    } else {
      return [require.resolve('vue-style-loader')].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    // sass: generateLoaders('sass', { indentedSyntax: true }),
    // scss: generateLoaders('sass'),
    // stylus: generateLoaders('stylus'),
    // styl: generateLoaders('stylus')
  }
}

module.exports = {
  loaders: cssLoaders({
    sourceMap: true,
    extract: isProduction
  })
}
