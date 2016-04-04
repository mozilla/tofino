# src/

## content

## main

Node code that runs in the main process and has access to Electron APIs. Spawns render processes with Electron.

## services

Services used in the main-process.

## shared

Utilities and modules used by both main-process/node code and render-process/browser code.

## ui

The source for web apps running in the render process. In `ui/browser`, the Redux/React app for the browser chrome UI. Served via webpack in `services/server.js`. `ui/shared` is presumebly to be used by any app in `ui/*`
