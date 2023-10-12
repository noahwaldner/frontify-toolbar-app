// This code is executed when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Add an event listener for the toggle switch
  document.querySelectorAll('li[data-type="service"]').forEach((entry) => {
    entry.dataset.type;
    const buttonStartStop = entry.querySelector(
      "button[data-type='start-stop']"
    );
    const buttonLog = entry.querySelector("button[data-type='log']");
    buttonStartStop.addEventListener("click", async function () {
      if (buttonStartStop.innerText === "Start") {
        buttonStartStop.textContent = "Stop";
        await window.electronAPI.startService(entry.dataset.service);
      } else {
        buttonStartStop.textContent = "Start";
        await window.electronAPI.stopService(entry.dataset.service);
      }
    });
    buttonLog.addEventListener("click", async function () {
      await window.electronAPI.showLog(entry.dataset.service);
    });
  });

  document
    .querySelectorAll('li[data-type="configuration"]')
    .forEach((entry) => {
      entry.dataset.type;
      const buttonSetPath = entry.querySelector("button[data-type='set']");
      const path = entry.querySelector("input");
      buttonSetPath.addEventListener("click", async function () {
        const selectedPath = await window.electronAPI.setPath(
          entry.dataset.entry
        );
        if (selectedPath) {
          fetchConfig();
        }
      });
    });

  const fetchConfig = () => {
    window.electronAPI.getAll().then((config) => {
      console.log(config);
      Object.keys(config).forEach((key) => {
        const entry = document.querySelector(`li[data-entry="${key}"]`);
        if (entry) {
          const path = entry.querySelector("input");
          path.value = config[key].value;
        }
      });
    });
  };

  fetchConfig();

  const testButton = document.querySelector('button[data-type="test"]');
  testButton.addEventListener("click", async function (config) {
    console.log(config);
  });
});
