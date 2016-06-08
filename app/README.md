# src/

## main

Node code that runs in the main process and has access to Electron APIs. Spawns render processes with Electron.

## services

Services used for the main and renderer processes.

## ui

The source for webapps running in the render process. In `ui/browser`, the Redux/React app for the browser chrome UI.
In `ui/content`, the "tofino://" pages like history or bookmarks. Finally, `ui/shared` is to be used by any app in `ui/*`

## shared

Anything used by 'main', 'services' and 'ui'. Also `shared/preload` contains scripts injected in content.`
