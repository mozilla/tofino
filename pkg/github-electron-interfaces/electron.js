/*
 Copyright 2016 Mozilla

 Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 this file except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed
 under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
 CONDITIONS OF ANY KIND, either express or implied. See the License for the
 specific language governing permissions and limitations under the License.
 */

/**
 * Cribbed from
 * https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/github-electron/github-electron.d.ts.
 */
declare module 'electron' {
  declare var app: any;
  declare var globalShortcut: any;
  declare var ipcMain: any;

	declare interface LoadURLOptions {
		/**
		 * HTTP Referrer URL.
		 */
		httpReferrer?: string;
		/**
		 * User agent originating the request.
		 */
		userAgent?: string;
		/**
		 * Extra headers separated by "\n"
		 */
		extraHeaders?: string;
	}

  declare interface WebContents {
		send(channel: string, ...args: any[]): void;
		once(event: string, listener: Function): WebContents;
  }

  declare class BrowserWindow {
    scope: number; // This is Tofino specific.
    didFinishLoadPromise: Promise<void>; // This is Tofino specific.

    webContents: WebContents;

		loadURL(url: string, options?: LoadURLOptions): void;

    static fromId(id: number): ?BrowserWindow;
    static fromWebContents(webContents: WebContents): ?BrowserWindow;
    static getAllWindows(): BrowserWindow[];

		/**
		 * Get the unique ID of this window.
		 */
		id: number;
		/**
		 * Force closing the window, the unload and beforeunload event won't be emitted
		 * for the web page, and close event would also not be emitted for this window,
		 * but it would guarantee the closed event to be emitted.
		 * You should only use this method when the renderer process (web page) has crashed.
		 */
		destroy(): void;
		/**
		 * Try to close the window, this has the same effect with user manually clicking
		 * the close button of the window. The web page may cancel the close though,
		 * see the close event.
		 */
		close(): void;
		/**
		 * Focus on the window.
		 */
		focus(): void;
		/**
		 * Remove focus on the window.
		 */
		blur(): void;
		/**
		 * @returns Whether the window is focused.
		 */
		isFocused(): boolean;
		/**
		 * Shows and gives focus to the window.
		 */
		show(): void;
		/**
		 * Shows the window but doesn't focus on it.
		 */
		showInactive(): void;
		/**
		 * Hides the window.
		 */
		hide(): void;
		/**
		 * @returns Whether the window is visible to the user.
		 */
		isVisible(): boolean;
		/**
		 * Maximizes the window.
		 */
		maximize(): void;
		/**
		 * Unmaximizes the window.
		 */
		unmaximize(): void;
		/**
		 * @returns Whether the window is maximized.
		 */
		isMaximized(): boolean;
		/**
		 * Minimizes the window. On some platforms the minimized window will be
		 * shown in the Dock.
		 */
		minimize(): void;
		/**
		 * Restores the window from minimized state to its previous state.
		 */
		restore(): void;
		/**
		 * @returns Whether the window is minimized.
		 */
		isMinimized(): boolean;
		/**
		 * Sets whether the window should be in fullscreen mode.
		 */
		setFullScreen(flag: boolean): void;
		/**
		 * @returns Whether the window is in fullscreen mode.
		 */
		isFullScreen(): boolean;
  }
}
