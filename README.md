# Remediation Vault's Web UI 2.0.0

## Contributing

Anyone and everyone is welcome to contribute. Please take a moment to review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)

If your pull request contains JavaScript patches or features, you must include relevant unit tests.

Editor preferences are available in the [editor config](.editorconfig) for easy use in common text editors. Read more and download plugins at [http://editorconfig.org](http://editorconfig.org).

## What you need to develop, or compile, Remediation Vault

In order to develop, and compile, Remediation Vault, you need to have Node.js/npm latest, and git 1.8 or later. (Earlier versions might work OK, but are not tested.)

For Windows you have to download and install [git](http://git-scm.com/downloads) and [Node.js](http://nodejs.org/download/).

Mac OS users should install [Homebrew](http://mxcl.github.com/homebrew/). Once Homebrew is installed, run `brew install git` to install git,
and `brew install node` to install Node.js.

Linux/BSD users should use their appropriate package managers to install git and Node.js, or build from source.

## Bower: front-end package manager

Remediation Vault's Web UI uses [Bower](http://bower.io) to manage all third party dependencies.

### Install Bower

From the command line:

0. `cd` into the repo's root directory.
1. Install `bower` globally with `npm install -g bower`.
2. Install the [necessary local dependencies](bower.json) via `bower install`

## Compiling CSS and Javascript

Remediation Vault's Web UI uses [Grunt](http://gruntjs.com/) to manage compilation for development and distribution.

### Install Grunt

From the command line:

0. `cd` into the repo's root directory.
1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Install the [necessary local dependencies](package.json) via `npm install`

**Unfamiliar with `npm`? Don't have node installed?** npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

### Available Grunt commands

#### Compile for distribution - `grunt dist`
`grunt dist` creates the `/dist` directory with compiled files. **Requires recess.**

#### Watch - `grunt dev`
This is a convenience method for watching the **LESS, JS, and HTML** files, compiling if necessary, and hosting them at `localhost:8000`

### Troubleshooting dependencies

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

## Authors

- Luis Aleman
- Sergio Polo
- Ankit Khatri
