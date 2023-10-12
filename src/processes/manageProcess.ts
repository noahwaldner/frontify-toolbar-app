import { spawn, exec } from "node:child_process";
import fs from "node:fs";
import { getConfigValue } from "../config/configurationAccess";
import { ConfigurationKeys } from "../config/configurationTypes";
import  process  from "node:process";

export const enum Service {
  InDesignServer = "InDesignServer",
}

const spawnService = (service: Service) => {
  switch (service) {
    case Service.InDesignServer:

      return spawn(getConfigValue(ConfigurationKeys.InDesignServerPath), [
        "-port",
        getConfigValue(ConfigurationKeys.InDesignServerPort),
      ], {detached: true});
    default:
      throw new Error("Service not found");
  }
};

export const startServer = (service: Service) => {
  const logStream = fs.createWriteStream(`./${service}.log`, { flags: "a" });
  const serviceProcess = spawnService(service);
  serviceProcess.stdout.pipe(logStream);
  serviceProcess.stderr.pipe(logStream);
  serviceProcess.on("close", function (code) {
    fs.truncate(`./${service}.log`, 0, () => {});
    console.log("child process exited with code " + code);
  });
  serviceProcess.on("exit", function (code) {
    fs.truncate(`./${service}.log`, 0, () => {});
    console.log("child process exited with code " + code);
  });
  serviceProcess.on("error", function (err) {
    fs.truncate(`./${service}.log`, 0, () => {});
    console.log("child process exited with error " + err);
  });

  const endProcess = () => {
    process.kill(-serviceProcess.pid);
    logStream.end();
    fs.truncate(`./${service}.log`, 0, () => {});
  }
  return endProcess;
};

export const showLogs = (service: Service) => {
  exec(`open -a 'Console.app' './${service}.log'`);
}
