import { getRepository } from 'typeorm';
import { ConfigParameter } from '../entity/ConfigParameter';
import { dialog } from 'electron';
import { ParameterMod } from '../entity/ParameterMod';

export class ConfigParameterController {
    public static getAll = async (): Promise<ConfigParameter[]> => {
        const parameterRepo = getRepository(ConfigParameter);
        return parameterRepo.find();
    }

    public static saveAll = async (
        parameters: ConfigParameter[]
    ): Promise<boolean> => {
        const parameterRepo = getRepository(ConfigParameter);
        return new Promise(async (resolve, reject) => {
            for (const p of parameters) {
                // avoid undefined id when p is new instance
                p.id = p.id ? p.id : 0;

                let parameter = await parameterRepo.findOne(p.id);

                if (!parameter) {
                    // create new parameter
                    parameter = new ConfigParameter();
                }
                parameter.name = p.name;
                parameter.type = p.type;
                parameter.defaultValue = p.defaultValue;
                parameter.description = p.description;

                await parameterRepo.save(parameter);
            }
            // resolve promise when done
            resolve(true);
        });
    }

    public static async deleteParameter(id: number): Promise<boolean> {
        const parameterRepo = getRepository(ConfigParameter);
        const modRepo = getRepository(ParameterMod);

        return new Promise(async (resolve, reject) => {
            const parameter = await parameterRepo.findOne(id);
            if (parameter) {
                const mods = await modRepo.find({ where: { configParameter: parameter } });
                for (const mod of mods) {
                    modRepo.delete(mod);
                }
                await parameterRepo.delete(id);
            }

            // resolve promise when done
            resolve(true);
        });
    }

    public static async deleteAll(): Promise<boolean> {
        const parameterRepo = getRepository(ConfigParameter);
        const modRepo = getRepository(ParameterMod);

        return new Promise(async (resolve, reject) => {
            // show message box
            const action = dialog.showMessageBox({
                type: 'warning',
                buttons: ['Ja', 'Abbrechen'],
                defaultId: 0,
                title: 'Alle Parameter löschen?',
                message: 'Sollen wirklich alle Konfigurationsparameter gelöscht werden?',
                cancelId: 1,
            });

            if (action === 0) {
                const parameters = await parameterRepo.find();
                for (const parameter of parameters) {
                    const mods = await modRepo.find({ where: { configParameter: parameter } });
                    for (const mod of mods) {
                        await modRepo.delete(mod);
                    }
                    await parameterRepo.delete(parameter);
                }

            }

            // resolve promise when done
            resolve(true);
        });
    }
}
