import { Setting } from '@/db/entity/Setting';

export class SettingModel {
    public filePath: string = '';
    public fileName: string = '';
    public fileExtension: string = '';
    public saveModificationsOnly: boolean = false;

    constructor(setting?: Setting) {
        if (setting) {
            Object.assign(this, setting);
        }
    }
}
