import { ConfigSetup } from '../entity/ConfigSetup';
import { getRepository } from 'typeorm';
import { ConfigParameter } from '../entity/ConfigParameter';
import { ParameterMod } from '../entity/ParameterMod';
import { dialog } from 'electron';
import * as fs from 'fs';
import { Setting } from '../entity/Setting';
import { SettingController } from './SettingController';
import { ConfigSetupModel } from '../../models/ConfigSetup.model';
import { ConfigParameterModel } from '../../models/ConfigParameter.model';

export class SetupController {
    public static getAll = async (): Promise<ConfigSetup[]> => {
        const setupRepo = getRepository(ConfigSetup);
        return await setupRepo.find();
    }

    public static getSetupName = async (setupId: number): Promise<string> => {
        const setupRepo = getRepository(ConfigSetup);

        return new Promise(async (resolve, reject) => {
            if (setupId === 0) {
                resolve('');
            } else {
                const setup = await setupRepo.findOne(setupId);
                if (setup) {
                    resolve(setup.name);
                }
            }
        });
    }


    public static getSetup = async (
        setupId: number
    ): Promise<ConfigSetupModel> => {
        const setupRepo = getRepository(ConfigSetup);
        const parameterRepo = getRepository(ConfigParameter);
        const modRepo = getRepository(ParameterMod);

        return new Promise(async (resolve, reject) => {
            // list of all available parameters
            const availableParameters = await parameterRepo.find();

            if (setupId === 0) {
                const newSetup = new ConfigSetupModel();
                newSetup.parameters = availableParameters
                    .map((param: ConfigParameter) => new ConfigParameterModel(param));
                resolve(newSetup);
            }

            const setup = await setupRepo.findOne(setupId);

            const setupModel = new ConfigSetupModel(setup);

            const setupModifications = await modRepo.find({
                where: { configSetup: setup },
                relations: ['configParameter']
            });

            availableParameters.forEach((param: ConfigParameter) => {
                const paramModel = new ConfigParameterModel(param);
                // try to find modification for this config parameter
                const modification = setupModifications.find((mod: ParameterMod) => {
                    return mod.configParameter.id === param.id;
                });

                // if present, reset value of parameter
                if (modification) {
                    paramModel.defaultValue = modification.value;
                    paramModel.isModification = true;
                }

                setupModel.parameters.push(paramModel);
            });

            resolve(setupModel);
        });
    }

    public static saveSetupParameter = async (
        setupId: number,
        setupName: string,
        setupDescription: string,
        setupParameters: ConfigParameter[]
    ): Promise<boolean> => {
        const parameterRepo = getRepository(ConfigParameter);
        const setupRepo = getRepository(ConfigSetup);
        const modRepo = getRepository(ParameterMod);

        return new Promise(async (resolve, reject) => {
            // should be there...otherwise the call makes no sense
            let setup = await setupRepo.findOne(setupId);

            // create setup if it does not exist (=> setupId = 0)
            if (!setup) {
                setup = new ConfigSetup();
            }

            setup.name = setupName;
            setup.description = setupDescription;
            setupRepo.save(setup);

            // get all available parameters
            const availableParameters = await parameterRepo.find();

            for (const param of availableParameters) {
                // setup parameter (=> potential modification)
                const setupParameter = setupParameters.find(
                    (setupParam: ConfigParameter) => {
                        return setupParam.id === param.id;
                    }
                );

                // HAS TO BE THERE!!!
                if (setupParameter) {
                    // modification for this particular setup and parameter
                    let mod = await modRepo.findOne({
                        where: { configParameter: param, configSetup: setup }
                    });

                    if (setupParameter.defaultValue !== param.defaultValue) {
                        // value was changed for this setup
                        if (!mod) {
                            // create modification if it does not exist...
                            mod = new ParameterMod();
                            mod.configParameter = param;
                            mod.configSetup = setup;
                        }
                        // ...and reset value
                        mod.value = setupParameter.defaultValue;

                        modRepo.save(mod);
                    } else {
                        // value equals defaultvalue of parameter: check whether mod exists and delete
                        if (mod) {
                            await modRepo.delete(mod);
                        }
                    }
                }
            }

            resolve(true);
        });
    }

    public static deleteSetup = async (setupId: number): Promise<boolean> => {
        const setupRepo = getRepository(ConfigSetup);
        const modRepo = getRepository(ParameterMod);

        return new Promise(async (resolve, reject) => {
            const setup = await setupRepo.findOne(setupId);

            if (setup) {
                // get mods and delete them
                const mods = await modRepo.find({ where: { configSetup: setup } });
                for (const mod of mods) {
                    await modRepo.delete(mod);
                }

                // delete setup
                await setupRepo.delete(setupId).catch((e) => console.log(e));
                resolve(true);
            }
            reject();
        });
    }

    public static downloadSetup = async (setupId: number): Promise<boolean> => {
        return new Promise(async (resolve, reject) => {
            const setting = await SettingController.getSetting();

            let savePath: string | undefined;

            if (setting.filePath !== '' && setting.fileName !== '') {
                savePath = setting.filePath + setting.fileName + setting.fileExtension;
            } else {
                // open save file dialog
                savePath = await dialog.showSaveDialog({
                    defaultPath: setting.filePath + setting.fileName,
                    filters: [{ name: 'config', extensions: ['properties', 'txt'] }]
                });
            }

            if (!savePath) {
                resolve(false);
            } else {
                // define file content
                const setup = await SetupController.getSetup(setupId);

                if (setting.saveModificationsOnly) {
                    setup.parameters = setup.parameters.filter((param: ConfigParameterModel) => param.isModification);
                }

                let fileContent = '';
                setup.parameters.forEach((parameter: ConfigParameterModel) => {
                    fileContent += `${parameter.name} = ${parameter.defaultValue}\n`;
                });

                // delete file if it exists
                if (fs.existsSync(savePath)) {
                    fs.unlinkSync(savePath);
                }
                // save file
                fs.writeFileSync(savePath, fileContent, { encoding: 'utf8', flag: 'w' });

                resolve(true);
            }

        });
    }

    /**
     * Returns defaultValue of given parameter formatted based on its type
     * @param parameter
     */
    private static getFormattedParameterValue(parameter: ConfigParameter): string {
        if (parameter.type === 'string') {
            return `\"${parameter.defaultValue}\"`;
        } else {
            return parameter.defaultValue;
        }
    }
}
