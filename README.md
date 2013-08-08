# Remediation Vault's Web UI 2.0.0

## Contributing

Anyone and everyone is welcome to contribute. Please take a moment to review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)

If your pull request contains JavaScript patches or features, you must include relevant unit tests.

Editor preferences are available in the [editor config](.editorconfig) for easy use in common text editors. Read more and download plugins at [http://editorconfig.org](http://editorconfig.org).

## What you need to develop/compile this project

In order to develop and/or compile Remediation Vault, you need to have Node.js/npm latest, and git 1.8 or later. (Earlier versions might work OK, but are not tested.)

For Windows you have to download and install [git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/download/).

Mac OS users should install [Homebrew](http://mxcl.github.com/homebrew/). Once Homebrew is installed, run `brew install git` to install git,
and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install git and Node.js, or build from source.

## Setting up the project environment

First, clone a copy of the main Remediation Vault git repo by running:

```bash
git clone git://github.com/toppatch/toppatch-ui-rewrite.git
```

Install the [grunt-cli](http://gruntjs.com/getting-started#installing-the-cli) and [bower](http://bower.io/) packages if you haven't before. These should be done as global installs:

```bash
npm install -g grunt-cli bower
```

Make sure you have `grunt` and `bower` installed by testing:

```bash
grunt -version
bower -version
```

Enter the Remediation Vault directory and install the Node and Bower dependencies, this time *without* specifying a global(-g) install:

```bash
cd jquery && npm install
```

## Compiling this project for deployment

Make sure you have followed the instructions in [Setting up the project environment](#setting-up-the-project-environment)

Then, to get a complete, minified, and linted version of Remediation Vault's Web UI, type the following:

```bash
grunt
```

The built version of Remediation Vault's Web UI will be put in the `/dist` subdirectory.

## Available Grunt commands

Command | Description
:---|:---
`grunt` | Run JSHint and QUnit tests and then compile CSS and JavaScript into `/dist`.
`grunt test` | Run JSHint and QUnit tests in [phantomjs](https://github.com/ariya/phantomjs/).
`grunt dev` | A convenience method that will **watch** LESS, JS, and HTML files in the `/app` directory, and host them at `localhost:8000`.

*Note: While running `grunt dev` LESS files will be compiled to `/app/css`, a git ignored directory.*

## Troubleshooting dependencies

Should you encounter problems with installing dependencies or running Grunt commands, uninstall all previous dependency versions (global and local). Then, rerun `npm install`.

## Versioning

Remediation Vault's Web UI will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit [http://semver.org/](http://semver.org/).
