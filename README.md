# Remediation Vault's Web UI 2.0.0

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)

## Loading Javascript dependencies

Remediation Vault's Web UI uses [Bower](http://bower.io) to manage all third party dependencies, with the temporary exception of Bootstrap 3.0.0.

### Install Bower

From the command line:

1. Install `bower` globally with `npm install -g bower`.
2. Install the [necessary local dependencies](bower.json) via `bower install`

## Compiling CSS and Javascript

Remediation Vault's Web UI uses [Grunt](http://gruntjs.com/) to manage compilation for development and distribution.

### Install Grunt

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Install the [necessary local dependencies](package.json) via `npm install`

**Unfamiliar with `npm`? Don't have node installed?** npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

### Available Grunt commands

#### Compile for distribution - `grunt dist`
`grunt dist` creates the `/dist` directory with compiled files. **Requires recess.**

#### Watch - `grunt watch`
This is a convenience method for watching the **LESS** files and automatically building them to `/app/css` whenever you save. **Requires recess.**

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
