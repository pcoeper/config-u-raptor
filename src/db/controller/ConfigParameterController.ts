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

        return new Promise(async (resolve, reject) => {
            const parameter = await parameterRepo.findOne(id);
            if (parameter) {
                await parameterRepo.delete(id);
            }

            // resolve promise when done
            resolve(true);
        });
    }

    public static async deleteAll(): Promise<boolean> {
        const parameterRepo = getRepository(ConfigParameter);

        return new Promise(async (resolve, reject) => {
            const parameters = await parameterRepo.find();
            for (const parameter of parameters) {
                await parameterRepo.delete(parameter);
            }

            // resolve promise when done
            resolve(true);
        });
    }
}
