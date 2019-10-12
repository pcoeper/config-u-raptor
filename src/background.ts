'use strict';

import 'reflect-metadata';
import { createConnection } from 'typeorm';

import { init_db } from './init_db';

import { app, protocol, BrowserWindow, ipcMain } from 'electron';
import {
    createProtocol,
    installVueDevtools
} from 'vue-cli-plugin-electron-builder/lib';
import { ConfigParameter } from './db/entity/ConfigParameter';
import { ConfigSetup } from './db/entity/ConfigSetup';
import { ParameterMod } from './db/entity/ParameterMod';
import { Setting } from './db/entity/Setting';
import { ConfigParameterController } from './db/controller/ConfigParameterController';
import { SetupController } from './db/controller/SetupController';
import { SettingController } from './db/controller/SettingController';
import { SettingModel } from './models/Setting.model';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true } }
]);

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.maximize();

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
        if (!process.env.IS_TEST) {
            win.webContents.openDevTools();
        }
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }

    // initialize db
    createConnection({
        type: 'sqlite',
        synchronize: true,
        logging: false,
        logger: 'simple-console',
        database: 'db.sqlite',
        entities: [ConfigParameter, ConfigSetup, ParameterMod, Setting]
    })
        .then(async (connection) => {
            await init_db(connection);
        })
        .catch((error) => console.log(error));

    win.on('closed', () => {
        win = null;
    });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installVueDevtools();
        } catch (e) {
            console.error('Vue Devtools failed to install:', e.toString());
        }
    }
    createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === 'win32') {
        process.on('message', (data) => {
            if (data === 'graceful-exit') {
                app.quit();
            }
        });
    } else {
        process.on('SIGTERM', () => {
            app.quit();
        });
    }
}

// IPC MAIN SECTION
// ConfigParameter
ipcMain.on('getAllConfigParameter', async (event: any, args: any) => {
    const parameters: ConfigParameter[] = await ConfigParameterController.getAll();
    event.reply('replyAllConfigParameter', parameters);
});

ipcMain.on(
    'saveConfigParameter',
    async (event: any, args: ConfigParameter) => {
        await ConfigParameterController.saveConfigParameter(args);
        const parameters = await ConfigParameterController.getAll();
        event.reply('replyAllConfigParameter', parameters);
    }
);

ipcMain.on('deleteConfigParameter', async (event: any, args: any) => {
    await ConfigParameterController.deleteParameter(args);
    const parameters = await ConfigParameterController.getAll();
    event.reply('replyAllConfigParameter', parameters);
});

ipcMain.on('deleteAllConfigParameter', async (event: any) => {
    await ConfigParameterController.deleteAll();
    const parameters = await ConfigParameterController.getAll();
    event.reply('replyAllConfigParameter', parameters);
});

// ConfigSetup
ipcMain.on('getAllConfigSetups', async (event: any, args: any) => {
    const setups = await SetupController.getAll();
    event.reply('replyAllConfigSetups', setups);
});

ipcMain.on('getSetup', async (event: any, setupId: number) => {
    const setup = await SetupController.getSetup(setupId);
    event.reply('replySetup', { name: setup.name, description: setup.description, parameters: setup.parameters });
});

ipcMain.on('saveSetupParameter', async (event: any, args: any) => {
    await SetupController.saveSetupParameter(args.setupId, args.setupName, args.setupDescription, args.parameters);
    event.reply('navigateBack');
});

ipcMain.on('deleteSetup', async (event: any, args: number) => {
    await SetupController.deleteSetup(args);
    const setups = await SetupController.getAll();
    event.reply('replyAllConfigSetups', setups);
});

ipcMain.on('downloadSetup', async (event: any, args: number) => {
    const status = await SetupController.downloadSetup(args);
    event.reply('replyDownload', status);
});

// Settings
ipcMain.on('openFilePath', async (event: any) => {
    const filePath = await SettingController.openFilePath();
    event.reply('replyFilePath', filePath);
});

ipcMain.on('getSetting', async (event: any) => {
    const setting = await SettingController.getSetting();
    event.reply('replySetting', setting);
});

ipcMain.on('saveSetting', async (event: any, newSetting: SettingModel) => {
    const setting = await SettingController.saveSetting(newSetting);
    event.reply('replySetting', setting);
});
