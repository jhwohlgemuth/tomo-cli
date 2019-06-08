# tomo-cli [![Build Status](https://img.shields.io/travis/jhwohlgemuth/tomo-cli.svg?logo=travis&style=for-the-badge)](https://travis-ci.org/jhwohlgemuth/tomo-cli) [![codecov](https://img.shields.io/codecov/c/github/jhwohlgemuth/tomo-cli.svg?logo=codecov&style=for-the-badge)](https://codecov.io/gh/jhwohlgemuth/tomo-cli)

> A friendly command line tool designed to help create sustainable software using web technology

## Install

```
$ npm install --global tomo-cli
```


## Usage

```js
$ tomo --help

  Usage
    tomo [command] [term] [options]

  Options

    --source-directory, -d  Directory for source code [Default: ./src]
    --output-directory, -o  Directory for build targets [Default: ./dist]
    --assets-directory, -a  Directory for assets [Default: ./assets]
    --use-rollup,           Use Rollup instead of Webpack [Default: false]
    --use-parcel,           Use Parcel instead of Webpack [Default: false]
    --use-react, -r         Add React support to workflow [Default: false]
    --react-version         React version for ESLint configuration [Default: '16.8']
    --ignore-warnings, -i   Ignore warning messages [Default: false]
    --skip-install, -s      Skip npm installations [Default: false]
    --overwrite             Copy files, even if they alrady exist [Default: false]
    --browser               Indicate tasks are intended for the browser [Default: false]
    --debug                 Show debug data [Default: false]

```


## License

MIT © [Jason Wohlgemuth](http://omaha.js.org)
