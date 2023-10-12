import { app, BrowserWindow } from "electron";

export const setupWindow = (app: Electron.App) => {
  let window;
  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });
  window = new BrowserWindow({
    width: 1000,
    height: 300,
    show: true,
    frame: false,
    webPreferences: {
      preload: `${__dirname}/src/interface/preload.js`,
    },
  });
  window.webContents.openDevTools();
  window.loadFile(`${__dirname}/src/interface/index.html`);
  return window;
};


export const showConfigurationWindow = (app: Electron.App) => {
  let window;
  window = new BrowserWindow({
    width: 1000,
    height: 500,
    webPreferences: {
      preload: `${__dirname}/src/interface/preload.js`,
    },
  });
  window.webContents.openDevTools();
  window.loadFile(`${__dirname}/src/interface/settings.html`);
  return window;
};
