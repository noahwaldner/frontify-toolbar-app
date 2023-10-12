import {
  app,
  BrowserWindow,
  Menu,
  nativeImage,
  Tray,
  ipcMain,
  dialog,
} from "electron";
import { setupWindow, showConfigurationWindow } from "./src/interface/setup";
import { setupTray } from "./src/tray/setup";
import {
  checkConfiguration,
  getConfigValue,
  getFullConfig,
  setConfigValue,
} from "./src/config/configurationAccess";
import { ConfigurationKeys } from "./src/config/configurationTypes";
import { Service, startServer, showLogs } from "./src/processes/manageProcess";
import { getAll } from "electron-json-storage";

const requiredConfigEntries = [
  ConfigurationKeys.InDesignServerPath,
  ConfigurationKeys.InDesignServerPort,
  ConfigurationKeys.SketchServerPath,
];

app.whenReady().then(() => {
  let killProcess = {};
  checkConfiguration(requiredConfigEntries)
    .then((config) => {
      const window = setupWindow(app);
      const tray = setupTray();
      tray.on("click", () => {
        const trayBounds = tray.getBounds();
        const windowBounds = window.getBounds();
        window.setPosition(
          trayBounds.x - windowBounds.width / 2 + trayBounds.width / 2,
          trayBounds.y
        );
        window.isVisible() ? window.hide() : window.show();
      });
    })
    .catch((error) => {
      showConfigurationWindow(app);
    });



  ipcMain.handle("config:getAll", async () => {
    const config = await getFullConfig();
    return config;
  });
  ipcMain.handle("config:status", async () => {
    checkConfiguration(requiredConfigEntries).then(() => {
      return true;
    }).catch(() => {
      return false;
    });
  });
  ipcMain.handle("config:select", (_, configEntry) => {
    const path = dialog.showOpenDialogSync({
      properties: ["openFile"],
    });
    if (path && path.length > 0) {
      setConfigValue(configEntry, path[0]);
    }
    return getConfigValue(configEntry);
  });

  ipcMain.handle("service:start", (_, service) => {
    killProcess[Service.InDesignServer] = startServer(service);
  });
  ipcMain.handle("service:stop", (_, service) => {
    killProcess[service];
    killProcess[service]();
  });
  ipcMain.handle("service:log", (_, service) => {
    showLogs(service);
  });
});
