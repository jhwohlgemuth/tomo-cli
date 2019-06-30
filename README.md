<div align="center">
    <img id="logo" src="https://raw.githubusercontent.com/jhwohlgemuth/tomo-cli/master/resources/tomo-logo.png" width="350px"/>
</div>
<br />
<div align="center">
    <a href="https://travis-ci.org/jhwohlgemuth/tomo-cli"><img src="https://img.shields.io/travis/jhwohlgemuth/tomo-cli.svg?logo=travis&style=for-the-badge" /></a>
    <a href="https://codecov.io/gh/jhwohlgemuth/tomo-cli"><img src="https://img.shields.io/codecov/c/github/jhwohlgemuth/tomo-cli.svg?logo=codecov&style=for-the-badge" /></a>
</div>

# tomo

> A friendly command line tool designed to help create sustainable software using web technology

## Install

```
$ npm install --global tomo-cli
```

## No install

```
$ npx tomo-cli new app [options]
```

## Usage

```js
$ tomo --help

  Usage

    tomo [commands] [terms] [options]


  Commands

    new, add, remove, version


  Terms

    [new]
    project, app, server

    [add]
    a11y, babel, browsersync, cypress, electron, esdoc, eslint, jest,
    marionette, makefile, parcel, postcss, react, reason, rollup, webpack

    [remove]
    a11y, browsersync, cypress, parcel, postcss, reason, rollup, webpack
   

  Options

    --version, -v           Print version
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
    --port, -p              Configure port for workflow tasks that use it [Default: 4669]
    --debug                 Show debug data [Default: false]

```

## BTW
> **tomo** means ["friend" in Japanese (友)](https://translate.google.com/#view=home&op=translate&sl=ja&tl=en&text=%E5%8F%8B)

## License

MIT © [Jason Wohlgemuth](https://twitter.com/jhwohlgemuth)
