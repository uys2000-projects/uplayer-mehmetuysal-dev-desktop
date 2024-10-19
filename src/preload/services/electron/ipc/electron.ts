import { BrowserWindow, ipcMain, IpcMainEvent } from "electron";

export const setTitle = (event: IpcMainEvent, title: string) => {
  const webContents = event.sender;
  const win = BrowserWindow.fromWebContents(webContents);
  if (win) win.setTitle(title);
};

export const loadElectronApi = () => {
  ipcMain.on("write-file", (event, title: string) => setTitle(event, title));
};
