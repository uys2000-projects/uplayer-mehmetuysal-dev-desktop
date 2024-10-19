import { ipcMain } from "electron";

const getBase = async () => {
  const fs = require("node:fs");
  const { app } = require("electron");
  const basePath = app.getPath("userData");
  return [fs, basePath] as [typeof fs, string];
};

export type writeFile = (path: string, content: string) => Promise<boolean>;
export const writeFile: writeFile = async (path, content) => {
  const [fs, basePath] = await getBase();
  return new Promise<boolean>((resolve, reject) => {
    fs.writeFile(basePath + path, content, (err) => {
      if (err) return reject(err);
      return resolve(true);
    });
  });
};

export type writeFileObject = (
  path: string,
  content: string
) => Promise<boolean>;
export const writeFileObject: writeFileObject = async (path, content) => {
  const [fs, basePath] = await getBase();
  return new Promise<boolean>((resolve, reject) => {
    fs.writeFile(basePath + path, JSON.stringify(content), (err) => {
      if (err) return reject(err);
      return resolve(true);
    });
  });
};

export type readFile = (path: string) => Promise<string>;
export const readFile: readFile = async (path: string) => {
  const [fs, basePath] = await getBase();
  return new Promise<string>((resolve, reject) => {
    fs.readFile(basePath + path, "utf8", (err, data) => {
      if (err) return reject(err);
      return resolve(data);
    });
  });
};

export type readFileObject = <T extends object>(path: string) => Promise<T>;
export const readFileObject: readFileObject = async <T extends object>(
  path: string
) => {
  const [fs, basePath] = await getBase();
  return new Promise<T>((resolve, reject) => {
    fs.readFile(basePath + path, "utf8", (err, data) => {
      if (err) return reject(err);
      return resolve(JSON.parse(data) as T);
    });
  });
};

export const loadFileSystem = () => {
  ipcMain.handle("write-file", (event, ...args) =>
    writeFile(...(args as Parameters<writeFile>))
  );
  ipcMain.handle("write-file-object", (event, ...args) =>
    writeFileObject(...(args as Parameters<writeFileObject>))
  );
  ipcMain.handle("read-file", (event, ...args) =>
    readFile(...(args as Parameters<readFile>))
  );
  ipcMain.handle("read-file-object", (event, ...args) =>
    readFileObject(...(args as Parameters<readFileObject>))
  );
};
