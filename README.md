# Remediation Vault's Web UI 2.0.0

## Contributing

Anyone and everyone is welcome to contribute. Please take a moment to review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)

If your pull request contains JavaScript patches or features, you must include relevant unit tests.

Editor preferences are available in the [editor config](.editorconfig) for easy use in common text editors. Read more and download plugins at [http://editorconfig.org](http://editorconfig.org).

## What you need to develop/compile this project

In order to develop and/or compile Remediation Vault, you need to Node.js/npm latest and git 1.7 or later.
(Earlier versions might work OK, but are not tested.)

For Windows you have to download and install [git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/download/).

Mac OS users should install [Homebrew](http://mxcl.github.com/homebrew/). Once Homebrew is installed, run `brew install git` to install git,
and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install git and [Node.js](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager).

## Developing Locally

Clone a copy of the main project repo by running:

```bash
git clone git://github.com/toppatch/toppatch-ui-rewrite.git
```

Install [grunt-cli](https://github.com/gruntjs/grunt-cli) as a global package:

```bash
npm install -g grunt-cli
```

Enter the Remediation Vault directory and install the project dependencies:

```bash
cd toppatch-ui-rewrite && npm install
```

Make sure `grunt` is installed, and working, by running:

```bash
grunt -version
```

### Running the development environment

At this point you are ready to start the development environment:

```bash
grunt
```

The environment is running and ready when you see `waiting...` in the command line.

The `grunt` task will do several sub-tasks for you:

- Compile the handlebars templates
- Compile the less files into usable css files
- Copy font and image files
- Run a local server to host all the relavent files
- Open a browser window to the server's index page (Only on start)
- Watch all source files, recompile source files, and refresh the server accordingly

**Note:** It is a good idea to leave the grunt task running while developing.

**WARNING:** Stop the grunt task when pulling from github. You have been warned.

Useful links:

- To view in a browser - [http://localhost:8000/](http://localhost:8000/)
- To run `core` unit tests in browser - [http://localhost:8000/core/tests/index.html](http://localhost:8000/core/tests/index.html)
- To run `rvault` unit tests in browser - [http://localhost:8000/rvault/tests/index.html](http://localhost:8000/rvault/tests/index.html)


## Deployment Build

If you have not already done so, clone a copy of the main project repo by running:

```bash
git clone git://github.com/toppatch/toppatch-ui-rewrite.git
```

Enter the project directory and run the build script:

```bash
cd toppatch-ui-rewrite && npm run-script build
```

The built version of Remediation Vault's Web UI will be put in the `/dist` subdirectory.

## Versioning

Remediation Vault's Web UI will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit [http://semver.org/](http://semver.org/).
