import { Common, Exec, Logger } from 'rnv';
import { notifySlack } from '../slackNotifier';

const { logSuccess, logTask } = Logger;

const iosFirebaseDeploy = (config: any) =>
    new Promise((resolve, reject) => {
        logTask('BUILD_HOOK:iosDeployFirebase');

        const basePath = Common.getAppFolder(config, config.platform);
        const ipaPath = `${basePath}/release/RNVApp.ipa`;

        const { version } = config.files.project.package;
        const token = config.files.workspace.project?.configPrivate?.firebase?.token;

        const firebaseId = Common.getConfigProp(config, config.platform, 'firebaseId');
        const title = Common.getConfigProp(config, config.platform, 'title');

        const args = `firebase appdistribution:distribute ${ipaPath} --app ${firebaseId} --groups "RS" --token="${token}"`;

        Exec.executeAsync(config, args, {
            shell: true,
            stdio: 'inherit',
            silent: false,
            privateParams: [token],
        })
            .then(() => notifySlack(`Deployed *${title}* (*${config.platform}*) *v${version}* to Firebase`, config))
            .then(() => {
                logSuccess('IPA Successfully uploaded to Firebase.');
                resolve(true);
            })
            .catch((error: any) =>
                notifySlack(
                    `YOU FAIL ME YET AGAIN, STARSCREAM.
                    
                    Deploy failed *${title}* (*${config.platform}*) version: *${version}* to *Firebase*:
                    
                    ${error}`,
                    config
                ).then(() => reject(error))
            );
    });

export { iosFirebaseDeploy };
