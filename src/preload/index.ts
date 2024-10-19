import { contextBridge, ipcRenderer } from "electron";
import { axios } from "./services/electron/isolated/axios";
import { test } from "./services/electron/isolated/test";

contextBridge.exposeInMainWorld("axios", axios);
contextBridge.exposeInMainWorld("isolatedTest", test);

contextBridge.exposeInMainWorld("electron", {
  ping: () => ipcRenderer.invoke("ping"),
});

const electronAPI = {
  setTitle: (title: string) => ipcRenderer.send("set-title", title),
};
contextBridge.exposeInMainWorld("electronAPI", electronAPI);

const fileSystemApi = {
  writeFile: (path: string, content: string) =>
    ipcRenderer.invoke("write-file", path, content),
  writeFileObject: (path: string, content: object) =>
    ipcRenderer.invoke("write-file-object", path, content),
  readFile: (path: string) => ipcRenderer.invoke("read-file", path),
  readFileObject: (path: string) =>
    ipcRenderer.invoke("read-file-object", path),
};
contextBridge.exposeInMainWorld("fileSystemApi", fileSystemApi);
declare global {
  interface Window {
    axios: typeof axios;
    isolatedTest: typeof test;
    electronAPI: typeof electronAPI;
    fileSystemApi: {
      writeFile: (path: string, content: string) => Promise<void>;
      writeFileObject: (path: string, content: string) => Promise<void>;
      readFile: (path: string) => Promise<string>;
      readFileObject: <T extends object>(path: string) => Promise<T>;
    };
  }
}
