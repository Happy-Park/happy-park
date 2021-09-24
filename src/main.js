const { app, BrowserWindow } = require("electron");
const path = require("path");
const updateErrorLog = require('../src/postgres').updateErrorLog
const db = require("../src/postgres").client;
db.connect()
let window;
app.on("ready", function () {
  window = new BrowserWindow({
    width: 1200,
    height: 700,
    minHeight: 700,
    minWidth: 1200,
    backgroundColor: "#ffffff",
    thickFrame: false,
    title: "Happy Park",
    icon: "assets/img/atracoes.png",
    titleBarStyle: "hidden",
    show: false,
    // autoHideMenuBar: true, //Não mostrar a barra de menu
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
  });
  window.loadFile(path.join(__dirname, "../pages/login.html"));
  let splash = new BrowserWindow({
    width: 512,
    height: 512,
    frame: false,
  });
  splash.loadFile(path.join(__dirname, "../assets/img/atracoes.png"));
  window.once("ready-to-show", () => {
    setTimeout(function () {
      splash.close(), window.show();
    }, 3000);
  });

  window.once('ready-to-show', () => {
    let query = "select * from set_logado(3)"
    db.query(query, (err, res) => {
      if (err) {
        console.log(err);
        updateErrorLog(query, err)
        app.quit()
      } else {
      }
    });
  })

  window.once('closed', (e) => {
    let query = "select * from set_logado(3)"
      db.query(query, (err, res) => {
        if (err) {
          console.log(err);
          updateErrorLog(query, err)
          e.preventDefault()
        } else {
          e.defaultPrevented = false
          app.quit();
        }
      });
  });
});
