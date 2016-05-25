# Building Tofino

## All platforms

Ensure you have the following installed and accessible in your `PATH` environment variable.

* [Node.js](https://nodejs.org) >= 6.1.0
  * To manage multiple node installations, consider using [nvm](https://github.com/creationix/nvm)
* [Python 2.7](https://www.python.org/) (`python` must be in path)

### Windows

* Install [Visual Studio 2013](https://www.visualstudio.com/news/vs2013-community-vs)
* Install [Visual C++ Redistributable for VS2015](https://www.microsoft.com/en-us/download/details.aspx?id=48145), as currently Electron is built with VS2015. After [electron/electron#5528](https://github.com/electron/electron/issues/5528) has been fixed, this is no longer necessary, but we still need to update to Electron 1.1.0 in #517.
* Use the [VS2013 Developer Command Prompt](http://stackoverflow.com/a/22702405), or otherwise have your environment variables set correctly.

### Linux

* Install your platform's build essentials, i.e. `sudo apt-get install build-essential`

### OSX

Installation instructions here use [Homebrew](http://brew.sh/). You don't need `nvm`, but makes installing and managing node versions simple.

```
$ brew install node python
```

## Building

Once all dependencies are installed, you should be able to just install the node dependencies via npm:

```
npm install
```

At this point you can run a build via:

```
npm run dev
```
