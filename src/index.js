import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { randomInt } from 'node:crypto';
import fs  from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 600,
    height: 450,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'pages/splashscreen.html'));
  mainWindow.maximize();
  mainWindow.menuBarVisible = false;

  mainWindow.fullScreen = false;
    
  // Listen for IPC event to open DevTools
  ipcMain.on('open-devtools', () => {
    if (mainWindow) {
      console.log('Page Loaded! Now printing...'); // Debugging line
      mainWindow.webContents.printToPDF({ marginsType: 0, printBackground: true,
        pageSize: { width: 3.3, height: 7.09 }
       })
      .then(data => {
          fs.writeFileSync('output.pdf', data);
          console.log('PDF Saved as output.pdf');
      })
      .catch(error => console.error(`PDF Generation Failed: ${error}`));
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();
  // mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-navigate', (event, url) => {
    if (!url.includes('/form.html')) return;

    console.log('Page Loaded! Now printing...'); // Debugging line
    mainWindow.webContents.printToPDF({ marginsType: 0, printBackground: true,
      pageSize: { width: 227, height: 510 }
     })
    .then(data => {
        fs.writeFileSync('output.pdf', data);
        console.log('PDF Saved as output.pdf');
    })
    .catch(error => console.error(`PDF Generation Failed: ${error}`));
  });
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
