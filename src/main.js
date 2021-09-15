const { app, BrowserWindow } = require("electron");
const path = require("path");

let window;

async function createWindow() {
  window = new BrowserWindow({
    width: 1200,
    height: 700,
    minHeight: 700,
    minWidth: 1200,
    backgroundColor: "#ffffff",
    thickFrame: false,
    title: "Happy Park",
    icon: "assets/img/atracoes.png",
    // autoHideMenuBar: true, //Não mostrar a barra de menu
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  window.loadFile(path.join(__dirname, "../pages/login.html"));
}

app.on("ready", createWindow);

