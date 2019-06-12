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
    return new Promise(async (resolve, reject) => {
      for (const p of parameters) {
        let saveParam = false;
        let parameter = await parameterRepo.findOne(p.id);

        // parameter already exists -> update?
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
          // create new parameter
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
      }
      // resolve promise when done
      resolve(true);
    });
  }
}
