import {Tray, Menu, nativeImage} from "electron";
import path from "path";

let tray;

export const setupTray = () => {
  tray = new Tray(getIcon());
  tray.setToolTip("This is my application.");
  tray.setIgnoreDoubleClickEvents(true);

  return tray;
}

const getIcon = () => {
  let icon = nativeImage.createFromPath(
    path.join(__dirname, "/src/images/favicon.png")
  );
  icon = icon.resize({
    height: 16,
    width: 16,
  });
  return icon;
}
