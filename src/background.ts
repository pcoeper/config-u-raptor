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
import { ConfigParameterController } from './db/controller/ConfigParameterController';
import { SetupController } from './db/controller/SetupController';

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
        entities: [ConfigParameter, ConfigSetup, ParameterMod]
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
    'saveAllConfigParameter',
    async (event: any, args: ConfigParameter[]) => {
        await ConfigParameterController.saveAll(args);
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
    event.reply('replySetup', { name: setup.name, parameters: setup.parameters });
});

ipcMain.on('saveSetupParameter', async (event: any, args: any) => {
    await SetupController.saveSetupParameter(args.setupId, args.setupName, args.parameters);
    event.reply('navigateBack');
});

ipcMain.on('deleteSetup', async (event: any, args: number) => {
    await SetupController.deleteSetup(args);
    const setups = await SetupController.getAll();
    event.reply('replyAllConfigSetups', setups);
});

ipcMain.on('downloadSetup', async (event: any, args: number) => {
    await SetupController.downloadSetup(args);
});
