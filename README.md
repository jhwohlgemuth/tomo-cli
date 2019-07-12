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
$ tomo [command] [terms] [options]
```

## No install

```
$ npx tomo-cli [command] [terms] [options]
```

## Usage

> tomo wants to help you explore and exploit modern web technologies. With a strong focus on Developer Experience (DX), tomo will allow you to build new stuff and augment existing stuff. "No [FOMO](https://en.wikipedia.org/wiki/Fear_of_missing_out) with tomo!"™

#### Create a new app with [Marionette.js](https://marionettejs.com/) and [Webpack](https://webpack.js.org/)

<div align="center">
    <img class="gif" src="https://raw.githubusercontent.com/jhwohlgemuth/tomo-cli/master/resources/tomo-new-app.gif"/>
</div>

#### Create a new app using [React](https://reactjs.org/) and [Parcel](https://parceljs.org/) (with blazing fast [HMR](https://parceljs.org/hmr.html))

<div align="center">
    <img class="gif" src="https://raw.githubusercontent.com/jhwohlgemuth/tomo-cli/master/resources/tomo-new-app--use-react--use-parcel.gif"/>
</div>

#### Add [ESLint](https://eslint.org/) to your project

<div align="center">
    <img class="gif" src="https://raw.githubusercontent.com/jhwohlgemuth/tomo-cli/master/resources/tomo-add-eslint.gif"/>
</div>

#### Select what you want to add via the tomo CLI "add" menu

<div align="center">
    <img class="gif" src="https://raw.githubusercontent.com/jhwohlgemuth/tomo-cli/master/resources/tomo-add.gif"/>
</div>

#### Replace [Webpack](https://webpack.js.org/) with [Rollup](https://rollupjs.org/guide/en/)

<div align="center">
    <img class="gif" src="https://raw.githubusercontent.com/jhwohlgemuth/tomo-cli/master/resources/tomo-replace-webpack-with-rollup.gif"/>
</div>

#### Made a mistake while typing? tomo has your back ;)

<div align="center">
    <img class="gif" src="https://raw.githubusercontent.com/jhwohlgemuth/tomo-cli/master/resources/tomo-oops.gif"/>
</div>


### Read the help! So exciting!

```bash
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

<a href="https://app.fossa.com/projects/git%2Bgithub.com%2Fjhwohlgemuth%2Ftomo-cli?ref=badge_large" alt="FOSSA Status"><img src="https://app.fossa.com/api/projects/git%2Bgithub.com%2Fjhwohlgemuth%2Ftomo-cli.svg?type=large"/></a>
