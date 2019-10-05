import { dialog } from 'electron';

export class SettingController {
    public static openFilePath = async (): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            const filePath = dialog.showOpenDialog({ properties: ['openDirectory'] });

            if (!filePath) {
                resolve('');
            } else {
                resolve(filePath[0] + '/');
            }
        });
    }
}
