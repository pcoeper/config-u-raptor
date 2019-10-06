import { dialog } from 'electron';
import { Setting } from '../entity/Setting';
import { getRepository } from 'typeorm';
import { SettingModel } from '@/models/Setting.model';

export class SettingController {
    public static setting: Setting;

    public static openFilePath = async (): Promise<string> => {
        return new Promise(async (resolve, reject) => {
            const filePath = dialog.showOpenDialog({ properties: ['openDirectory', 'createDirectory'] });

            if (!filePath) {
                resolve('');
            } else {
                resolve(filePath[0] + '/');
            }
        });
    }

    public static saveSetting = async (newSetting: SettingModel): Promise<Setting> => {
        const settingRepo = getRepository(Setting);

        return new Promise(async (resolve, reject) => {
            const setting = await SettingController.getSetting();
            setting.filePath = newSetting.filePath;
            setting.fileName = newSetting.fileName;
            await settingRepo.save(setting);
            resolve(setting);
        });
    }

    public static getSetting = async (): Promise<Setting> => {
        const settingRepo = getRepository(Setting);
        return new Promise(async (resolve, reject) => {
            if (!SettingController.setting) {
                let setting = await settingRepo.findOne(1);
                if (!setting) {
                    setting = await settingRepo.save(new Setting());
                }
                SettingController.setting = setting;
            }
            resolve(SettingController.setting);
        });
    }
}
