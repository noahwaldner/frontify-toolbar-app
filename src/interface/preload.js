const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  getAll: () => ipcRenderer.invoke(`config:getAll`),
  showLog: (service) => {
    ipcRenderer.invoke(`service:log`, service);
  },
  startService: (service) => ipcRenderer.invoke(`service:start`, service),
  stopService: (service) => ipcRenderer.invoke(`service:stop`, service),
  setPath: (entry) => ipcRenderer.invoke(`config:select`, entry),
});
