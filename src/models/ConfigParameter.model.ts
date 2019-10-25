import { ConfigParameter } from '@/db/entity/ConfigParameter';

export class ConfigParameterModel {
    public id: number = 0;
    public name: string = '';
    public type: string = '';
    public defaultValue: string = '';
    public description: string = '';
    public isModification: boolean = false;

    constructor(parameter?: ConfigParameter) {
        if (parameter) {
            Object.assign(this, parameter);
        }
    }
}
