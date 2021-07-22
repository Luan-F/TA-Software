const { app, BrowserWindow } = require('electron');

function createWindow(){
	const window = new BrowserWindow({width: 800, height: 600, webPreferences: {nodeIntegration: true, contextIsolation: false}});

	window.loadFile('index.html');
}

app.whenReady().then(() => {
	createWindow();
})