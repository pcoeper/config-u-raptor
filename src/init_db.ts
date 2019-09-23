import { Connection } from 'typeorm';
import { ConfigParameter } from './db/entity/ConfigParameter';

export async function init_db(connection: Connection): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
        const parameterRepo = connection.getRepository(ConfigParameter);
        const availableParameters = await parameterRepo.find();

        if (availableParameters.length === 0) {
            const parameterList: ConfigParameter[] = [];

            parameterList.push(createConfigParameter('loadInitData', 'boolean', 'true', ''));
            parameterList.push(createConfigParameter('initDataMode', 'string', 'NEUTRAL', ''));
            parameterList.push(createConfigParameter('productionMode', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('customerName', 'string', '', ''));
            // Focke SAP
            parameterList.push(createConfigParameter('fockeSAPAdapterEnabled', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('inubitUrl', 'string', '', ''));
            parameterList.push(createConfigParameter('inubitUser', 'string', '', ''));
            parameterList.push(createConfigParameter('inubitPass', 'string', '', ''));
            parameterList.push(createConfigParameter('system', 'string', '', ''));

            // Settings
            parameterList.push(createConfigParameter('cubeStatisticSingleSPAllowed', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('isSkillVerificationEnabled', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('isPasswordRestrictionEnabled', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('monthToKeepPseudonymisiertUserData', 'number', '48', ''));
            parameterList.push(createConfigParameter('contingentsEnabled', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('defaultLocale', 'string', 'DE', ''));
            parameterList.push(createConfigParameter('isProjectEnabled', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('licenseBillForSimpressiveEnabled', 'boolean', 'true', ''));
            parameterList.push(createConfigParameter('instanceColor', 'string', '', ''));
            parameterList.push(createConfigParameter('isSuggestedDurationTimeForWpEnabled', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('isWarrantyProcessEnabled', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('warrantyDuration', 'number', '3', ''));

            // AUTH 3rd-Party
            parameterList.push(createConfigParameter('isSignatureEnabled', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('fpSignUsername', 'string', '', ''));
            parameterList.push(createConfigParameter('fpSignPassword', 'string', '', ''));
            parameterList.push(createConfigParameter('fpSignURI', 'string', '', ''));
            parameterList.push(createConfigParameter('fpSignSettingId', 'number', '', ''));
            parameterList.push(createConfigParameter('fpSignExchangeType', 'string', '', ''));
            parameterList.push(createConfigParameter('fpSignPrintTraffic', 'boolean', 'true', ''));
            parameterList.push(createConfigParameter('fpAPISigningActive', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('catalogActivate4EysPrincipel', 'boolean', 'true', ''));

            // EMAIL
            parameterList.push(createConfigParameter('sendEmail', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('smtpHost', 'string', '', ''));
            parameterList.push(createConfigParameter('smtpUser', 'string', '', ''));
            parameterList.push(createConfigParameter('smtpPassword', 'string', '', ''));
            parameterList.push(createConfigParameter('senderEmail', 'string', '', ''));
            parameterList.push(createConfigParameter('supportEmail', 'string', '', ''));

            // COMPLIANCE EMAIL
            parameterList.push(createConfigParameter('complianceEmail', 'string', '', ''));
            parameterList.push(createConfigParameter('serviceProviderCanProposePrices', 'boolean', 'false', ''));

            // UPLOADS
            parameterList.push(createConfigParameter('baseDataPath', 'string', '', ''));
            parameterList.push(createConfigParameter('workPackageFileDataPath', 'string', '', ''));
            parameterList.push(createConfigParameter('workPackageDataPath', 'string', '', ''));

            parameterList.push(createConfigParameter('remoteBaseUrl', 'string', '', ''));

            // Version
            parameterList.push(createConfigParameter('version', 'string', '', ''));
            parameterList.push(createConfigParameter('commitHash', 'string', '', ''));

            // Collect selWPTimeInfo
            parameterList.push(createConfigParameter('collectTimeInfo', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('collectPastTimeInfo', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('enforceTimeCollection', 'boolean', 'false', ''));

            // Delivered Item in Evaluation
            parameterList.push(createConfigParameter('collectDeliveredItem', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('enforceDeliveredItem', 'boolean', 'false', ''));

            // FAQ
            parameterList.push(createConfigParameter('faqEnabled', 'boolean', 'false', ''));

            // CONTENT
            parameterList.push(createConfigParameter('signLogo', 'string', '', ''));
            parameterList.push(createConfigParameter('orderPDFLogo', 'string', '', ''));
            parameterList.push(createConfigParameter('orderPDFThemeColor', 'string', '', ''));
            parameterList.push(createConfigParameter('orderPDFFont', 'string', '', ''));

            // Backup strategy
            parameterList.push(createConfigParameter('yearsToKeepData', 'number', '10', ''));

            // Dataster
            parameterList.push(createConfigParameter('isDatasterEnabled', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('datasterUrl', 'string', '', ''));

            // Event Center
            parameterList.push(createConfigParameter('isEventCenterEnabled', 'boolean', 'false', ''));

            // Weclapp
            parameterList.push(createConfigParameter('isWeclappEnabled', 'boolean', 'true', ''));
            parameterList.push(createConfigParameter('weclappUrl', 'string', '', ''));
            parameterList.push(createConfigParameter('weclappToken', 'string', '', ''));
            parameterList.push(createConfigParameter('customOrderIdEnabled', 'boolean', 'false', ''));
            parameterList.push(createConfigParameter('accountEnabled', 'boolean', 'false', ''));

            // OpenID Connect
            parameterList.push(createConfigParameter('loginViaOpenIdEnabled', 'boolean', 'false', ''));

            parameterList.push(createConfigParameter('openIdIssuer', 'string', '', ''));
            parameterList.push(createConfigParameter('openIdClientId', 'string', '', ''));
            parameterList.push(createConfigParameter('openIdClientSecret', 'string', '', ''));
            parameterList.push(createConfigParameter('openIdRedirectUri', 'string', '', ''));
            parameterList.push(createConfigParameter('introspectClientID', 'string', '', ''));
            parameterList.push(createConfigParameter('introspectClientSecret', 'string', '', ''));


            for (const parameter of parameterList) {
                await parameterRepo.save(parameter);
            }

            console.log('Initialized db.');
        } else {
            console.log('db already exists.');
        }
        resolve(true);
    });
}

function createConfigParameter(name: string, type: string, defaultValue: string, description: string): ConfigParameter {
    const configParameter = new ConfigParameter();
    configParameter.name = name || '';
    configParameter.type = type || 'string';
    if (!defaultValue) {
        switch (configParameter.type) {
            case 'string':
                defaultValue = '';
                break;
            case 'number':
                defaultValue = '0';
                break;
            case 'boolean':
                defaultValue = 'false';
                break;
        }
    }
    configParameter.defaultValue = defaultValue;
    configParameter.description = description || '';
    return configParameter;
}
