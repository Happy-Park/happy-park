const { app, BrowserWindow } = require("electron");
const path = require("path");

let window;

async function createWindow() {
  window = new BrowserWindow({
    width: 1200,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  window.loadFile(path.join(__dirname, "../pages/login.html"));
}

app.on("ready", createWindow);
