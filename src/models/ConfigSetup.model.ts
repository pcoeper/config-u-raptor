import { ConfigSetup } from '@/db/entity/ConfigSetup';
import { ConfigParameterModel } from './ConfigParameter.model';

export class ConfigSetupModel {
    public id: number = 0;
    public name: string = '';
    public description: string = '';
    public parameters: ConfigParameterModel[] = [];

    constructor(configSetup?: ConfigSetup) {
        if (configSetup) {
            this.id = configSetup.id;
            this.name = configSetup.name;
            this.description = configSetup.description;
        }
    }
}
