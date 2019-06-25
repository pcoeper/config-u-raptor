import { ConfigSetup } from '../entity/ConfigSetup';
import { getRepository } from 'typeorm';
import { ConfigParameter } from '../entity/ConfigParameter';
import { ParameterMod } from '../entity/ParameterMod';

export class SetupController {
  public static getAll = async (): Promise<ConfigSetup[]> => {
    const setupRepo = getRepository(ConfigSetup);
    return await setupRepo.find();
  }

  public static getParameterOfSetup = async (
    setupId: number
  ): Promise<ConfigParameter[]> => {
    const setupRepo = getRepository(ConfigSetup);
    const parameterRepo = getRepository(ConfigParameter);
    const modRepo = getRepository(ParameterMod);

    return new Promise(async (resolve, reject) => {
      const availableParameters = await parameterRepo.find();

      if (setupId === 0) {
        resolve(availableParameters);
      }

      const setup = await setupRepo.findOne(setupId);

      const setupModifications = await modRepo.find({
        where: { configSetup: setup },
        relations: ['configParameter']
      });

      availableParameters.forEach((param: ConfigParameter) => {
        const modification = setupModifications.find((mod: ParameterMod) => {
          return mod.configParameter.id === param.id;
        });

        if (modification) {
          param.defaultValue = modification.value;
        }
      });

      resolve(availableParameters);
    });
  }

  public static saveSetupParameter = async (
    setupId: number,
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
        setup.name = 'New Setup';

        setupRepo.save(setup);
      }

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
        if (mods) {
          for (const mod of mods) {
            await modRepo.delete(mod.id);
          }
        }
        // delete setup
        await setupRepo.delete(setupId).catch((e) => console.log(e));
        resolve(true);
      }
      reject();
    });
  }
}
