# Vue Maker

Create Vue apps with no build configuration.

## Quick Start

```sh
npm i -g vue-maker
mkdir my-app
cd my-app
vue-maker init
vue-maker start
```

## Build

```sh
vue-maker build
```

##  Directory structure
```sh
my-app
├── package.json
├── .gitignore
└── src
    └── App.vue
    └── index.html
    └── index.js
    └── index.less
```
### Configure  `proxy` | `homepage` | `buildPath` | `alias` | `externals`
##### in package.json:
```json
{
  "homepage": "./",
  "buildPath": "build",
  "proxy": {
    "['/api']": {
      "target": "http://localhost:3000",
      "secure": false,
      "changeOrigin": true
    }
  },
  "WEBPACK_CONFIG": {
    "alias": {
      "@template": "./"
    },
    "externals": {}
  }
}
```
## Included modules 

```sh
vue
vuex
vue-router
vuex-router-sync

alloyfinger
fetch-jsonp
```

## Included polyfills
```sh
Promise
fetch
Object.assign
```

## Installed webpack loaders
```sh
babel-loader
vue-loader
vue-style-loader
style-loader
postcss-loader
css-loader
less-loader
file-loader
url-loader
```

## Babel presets
```javascript
const plugins = [
  require.resolve('babel-plugin-transform-vue-jsx'),
  require.resolve('babel-plugin-transform-es2015-destructuring'),
  require.resolve('babel-plugin-transform-class-properties'),
  require.resolve('babel-plugin-transform-decorators-legacy'),
  [
    require.resolve('babel-plugin-transform-object-rest-spread'),
    {
      useBuiltIns: true,
    },
  ],
  [
    require.resolve('babel-plugin-transform-runtime'),
    {
      helpers: false,
      polyfill: false,
      regenerator: true,
    },
  ],
];

module.exports = {
    presets: [
      [
        require.resolve('babel-preset-env'),
        {
          targets: {
            ie: 9,
            uglify: true,
          },
          useBuiltIns: false,
          modules: false,
        },
      ],
      require.resolve('babel-preset-stage-0'),
    ],
    plugins: plugins.concat([
      [
        require.resolve('babel-plugin-transform-regenerator'),
        {
          async: false,
        },
      ],
      require.resolve('babel-plugin-syntax-dynamic-import'),
    ]),
}
```

### Postcss plugins
```javascript
[
	require('postcss-flexbugs-fixes'),
	autoprefixer({
	  browsers: [
		'>1%',
		'last 4 versions',
		'Firefox ESR',
		'not ie < 9', 
	  ],
	}),
]
```
