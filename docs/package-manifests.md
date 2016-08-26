Tofino uses a two package manifest setup where node modules required to ship as-is with the
application are included in the `app/package.json` while those that are webpacked or otherwise used
at build or test time are included in the main `package.json` manifest.

Use the following to decide where to put a new module dependency:

* Packages used by the application itself (content service, UA service, main process, renderer
  process, preload scripts) should be placed in the `dependencies` section of `package.json` where
  possible.
  * Native modules should only be used in the UA or content service code and should be placed in
    the `dependencies` section of `app/package.json`.
  * Some modules aren't compatible with webpack and should also be placed in the `dependencies`
    section of `app/package.json` but this will only work for the UA and content service code.
* Packages used only by build and test code should be placed in the `devDependencies` section of
  `package.json`

When the application is built all of the processes are webpacked with the modules listed in
`app/package.json` marked as externals. These are copied into `lib/node_modules` and then bundled
with the packaged application.
