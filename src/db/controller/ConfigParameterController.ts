import { getRepository } from 'typeorm';
import { ConfigParameter } from '../entity/ConfigParameter';

export class ConfigParameterController {
  public static getAll = async (): Promise<ConfigParameter[]> => {
    const parameterRepo = getRepository(ConfigParameter);
    return parameterRepo.find();
  }
}
