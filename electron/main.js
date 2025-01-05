/* eslint-disable @typescript-eslint/no-require-imports */
const { app, BrowserWindow } = require('electron');

app.setName('Live Relay');

const createWindow = () => {
	const win = new BrowserWindow({
		width: 468,
		height: 597,
		minWidth: 448,
		minHeight: 577,
		useContentSize: true,
		title: 'Live Relay',
		icon: './icons/icon.png'
	});

	win.loadFile('index.html');
};

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
