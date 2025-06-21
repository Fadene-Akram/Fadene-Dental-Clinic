import { app, BrowserWindow } from "electron";
import { exec } from "child_process";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backendProcess;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: false,
    frame: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.maximize();

  // Don't load URL immediately - wait for Django check
  console.log("Window created, checking Django availability...");
}

// Function to check if Django is ready
function checkDjangoReady() {
  console.log("Checking if Django server is ready...");
  fetch("http://localhost:8000/health-check/")
    .then(() => {
      console.log("Django server is ready, loading app...");
      if (mainWindow) {
        mainWindow.loadURL("http://localhost:5173");
      }
    })
    .catch((error) => {
      console.log("Django not ready yet, retrying...", error);
      setTimeout(checkDjangoReady, 1000);
    });
}

app.whenReady().then(() => {
  // Start the window first
  createWindow();

  console.log("Starting Django backend...");

  // Properly handle paths with quotes to account for spaces
  const backendScript = path.resolve(
    __dirname,
    "../../Backend/start_backend.bat"
  );

  // Set the correct working directory - this should be the Backend folder
  backendProcess = exec(`"${backendScript}"`, {
    cwd: path.resolve(__dirname, "../../Backend"),
  });

  backendProcess.stdout?.on("data", (data) => {
    console.log(`Django: ${data}`);
  });

  backendProcess.stderr?.on("data", (data) => {
    console.error(`Django Error: ${data}`);
  });

  // Start checking for Django after a short delay
  setTimeout(checkDjangoReady, 3000);
});

app.on("window-all-closed", () => {
  if (backendProcess) {
    console.log("Killing backend process...");
    backendProcess.kill();
  }
  if (process.platform !== "darwin") app.quit();
});
