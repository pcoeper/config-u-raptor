import { ConfigSetup } from '../entity/ConfigSetup';
import { getRepository } from 'typeorm';
import { ConfigParameter } from '../entity/ConfigParameter';

export class SetupController {
  public static getAll = async (): Promise<ConfigSetup[]> => {
    const setupRepo = getRepository(ConfigSetup);
    return await setupRepo.find({ relations: ['modifications'] });
  }

  public static getParametersOfSetup = async (
    setupId: number
  ): Promise<ConfigParameter[]> => {
    const setupRepo = getRepository(ConfigSetup);
    const parameterRepo = getRepository(ConfigParameter);

    return new Promise(async (resolve, reject) => {
      const availableParameters = await parameterRepo.find();

      if (setupId === 0) {
        resolve(availableParameters);
      }
    });
  }
}
