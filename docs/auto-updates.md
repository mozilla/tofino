# Automatic Updates

Automatic updates are managed by github releases and an instance of
[nuts](https://github.com/GitbookIO/nuts) hosted on heroku.

There is currently no UI around updates, they are just downloaded automatically
in the background and on next startup the new version is used.

## Deploying a new update

1. Bump the version number in `package.json` and `app/package.json`.
2. Commit the change and tag with the version number prefixed with `v` (e.g. `v0.1.0`)
3. Push the commit and tags to github
4. CI will build the release assets and upload them to a release on Github
5. Once all the assets are there publish the release on Github
