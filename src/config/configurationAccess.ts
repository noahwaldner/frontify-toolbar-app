import { getAll, getSync, set } from "electron-json-storage";
import { ConfigurationKeys } from "./configurationTypes";

type ConfigurationEntry = {
  [key in ConfigurationKeys]: { value: string };
};

export const getConfigValue = (key: ConfigurationKeys) => {
  const data = getSync(key) as { value: string };
  return data.value;
};

export const setConfigValue = (key: ConfigurationKeys, value: string) => {
  set(
    key,
    {
      value,
    },
    (error) => {
      if (error) {
        console.error(error);
      }
    }
  );
};

export const getFullConfig = () => {
  return new Promise<ConfigurationEntry>((resolve, reject) => {
    getAll((error, data) => {
      if (error) {
        reject(error);
      }
      const typedConfig = data as ConfigurationEntry;
      resolve(typedConfig);
    });
  });
};

export const checkConfiguration = async (
  requiredConfigEntries: ConfigurationKeys[]
) => {
  return new Promise((resolve, reject) => {
    getFullConfig().then((config) => {
      requiredConfigEntries.forEach((entry) => {
        if (!config[entry]?.value) {
          console.log(`Missing configuration entry: ${entry}`);
          reject();
        }
      });
      resolve(true);
    });
  });
};
