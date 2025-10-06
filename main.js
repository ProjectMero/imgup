const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs').promises;
const remoteMain = require('@electron/remote/main'); 
const sharp = require('sharp'); // 追加

remoteMain.initialize(); 

let win;


app.on('ready', async () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: 'icon.png',//アイコン★
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
            
        },
        
    });
    

    win.setMenu(null);
 
    remoteMain.enable(win.webContents);

    let config;
    try {
        const data = await fs.readFile('config.json', 'utf8');
        config = JSON.parse(data);
        if (config.startup === false) {
            win.loadFile('index.html');
        } else {
            win.loadFile('index.html');
        }
    } catch (error) {
        console.error("[ERROR]構成ファイルの読み込みに失敗しました。");
        win.loadFile('index.html');
    }

    
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

ipcMain.on('go-back-to-home', (event) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
        win.loadFile('index.html');
    }
});

ipcMain.handle('upscale-image', async (event, buffer, ext) => {
  try {
    let sharpImage = sharp(Buffer.from(buffer));
    const metadata = await sharpImage.metadata();

    sharpImage = sharpImage
      .resize({
        width: metadata.width * 2,
        height: metadata.height * 2,
        kernel: 'cubic',
        fit: 'contain',
      })
      .sharpen({
        sigma: 3,
        flat: 3.0,
        jagged: 4.0
      })
      .modulate({
        brightness: 1.07,
        saturation: 1.12,
        contrast: 1.15
      });

    let upscaledBuffer;
    if (ext === 'jpeg' || ext === 'jpg') {
      upscaledBuffer = await sharpImage.jpeg({ quality: 95 }).toBuffer();
    } else if (ext === 'png') {
      upscaledBuffer = await sharpImage.png({ compressionLevel: 9 }).toBuffer();
    } else if (ext === 'tiff') {
      upscaledBuffer = await sharpImage.tiff({ quality: 95 }).toBuffer();
    } else if (ext === 'webp') {
      upscaledBuffer = await sharpImage.webp({ quality: 95 }).toBuffer();
    } else {
      upscaledBuffer = await sharpImage.toBuffer();
    }
    return upscaledBuffer.toString('base64');
  } catch (e) {
    console.error('Main process upscaling error:', e);
    throw e;
  }
});
