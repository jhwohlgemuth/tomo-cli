<div align="center">
    <img id="logo" src="https://raw.githubusercontent.com/jhwohlgemuth/tomo-cli/master/resources/tomo-logo.png" width="350px"/>
</div>

Code of Conduct
---------------
> Please read and adhere to the [code of conduct](CODE_OF_CONDUCT.md)

Issues
------
> When creating an issue, please complete the template to *the best of your ability*

If you would like to make a feature request or enhancement suggestion, please check the [Trello](https://trello.com/b/keq2Bc4R/tomo-cli) board first (feel free to make a comment on a card :smile:)

Pull Requests
-------------
> When submitting a pull request, please give your PR a descriptive name and complete the template to *the best of your ability*

> **Note:** Linux and Mac are the only actively supported platforms for development (although it is probably possible to use Windows)

**Setup**

```bash
# clone repository
git clone git@github.com/jhwohlgemuth/tomo-cli.git
cd tomo-cli
# install project dependencies
npm install
# verify voxelcss installed correctly by running tests
npm test
```

**Workflow Tasks**
- `npm run dev` *run build and lint tasks in watch mode using [stmux](https://github.com/rse/stmux)*
- `npm test` *run tests*
- `npm run test:ing` *run tests (watch mode)*
- `npm run lint` *lint code*
- `npm run lint:ing` *lint code (watch mode)*
- `npm run docs` *build and open docss*

Code must:
- Be "lint free" -- `npm run lint` with no warnings/errors
- Pass all tests -- `npm test` with no failures
- Maintain current code coverage (within reason)
- Be reasonable in scope and implementation details
- Pass all automated checks:
  - Run unit tests on [Travis CI](https://travis-ci.org/jhwohlgemuth/tomo-cli) (linux)
  - Calculate code coverage with [codecov.io](https://codecov.io/gh/jhwohlgemuth/tomo-cli)