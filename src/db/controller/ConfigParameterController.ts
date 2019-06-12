import { getRepository } from 'typeorm';
import { ConfigParameter } from '../entity/ConfigParameter';

export class ConfigParameterController {
  public static getAll = async (): Promise<ConfigParameter[]> => {
    const parameterRepo = getRepository(ConfigParameter);
    return parameterRepo.find();
  }

  public static saveAll = async (
    parameters: ConfigParameter[]
  ): Promise<boolean> => {
    const parameterRepo = getRepository(ConfigParameter);
    parameters.forEach(async (p: ConfigParameter) => {
      let saveParam = false;
      let parameter = await parameterRepo.findOne(p.id);
      if (parameter) {
        if (parameter.name !== p.name) {
          parameter.name = p.name;
          saveParam = true;
        }

        if (parameter.type !== p.type) {
          parameter.type = p.type;
          saveParam = true;
        }

        if (parameter.defaultValue !== p.defaultValue) {
          parameter.defaultValue = p.defaultValue;
          saveParam = true;
        }

        if (parameter.description !== p.description) {
          parameter.description = p.description;
          saveParam = true;
        }
      } else {
        parameter = new ConfigParameter();
        parameter.name = p.name;
        parameter.type = p.type;
        parameter.defaultValue = p.defaultValue;
        parameter.description = p.description;

        saveParam = true;
      }

      if (saveParam) {
        await parameterRepo.save(parameter);
      }
    });
    return Promise.resolve(true);
  }
}
