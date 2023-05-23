import path from 'path';
import { Common, Exec, Logger } from 'rnv';
import { notifySlack } from '../slackNotifier';

const { logSuccess, logTask } = Logger;

const androidFirebaseDeploy = (config: any) =>
    new Promise((resolve, reject) => {
        logTask('BUILD_HOOK:androidDeployFirebase');

        const appPath = path.join(config.paths.project.builds.dir, `${config.runtime.appId}_${config.platform}`);
        const apkPath = `${path.join(appPath, 'app/build/outputs/apk/release/app-release.apk')}`;

        const { version } = config.files.project.package;
        const token = config.files.workspace.project?.configPrivate?.firebase?.token;

        const firebaseId = Common.getConfigProp(config, config.platform, 'firebaseId');
        const firebaseGroups = Common.getConfigProp(config, config.platform, 'firebaseGroups');
        const title = Common.getConfigProp(config, config.platform, 'title');

        const args = `firebase appdistribution:distribute ${apkPath} --app ${firebaseId} --groups "${firebaseGroups}" --token="${token}"`;

        Exec.executeAsync(config, args, {
            shell: true,
            stdio: 'inherit',
            silent: false,
            privateParams: [token],
        })
            .then(() => notifySlack(`Deployed *${title}* (*${config.platform}*) *v${version}* to Firebase`, config))
            .then(() => {
                logSuccess('APK Successfully uploaded to Firebase.');
                resolve(true);
            })
            .catch((error: any) =>
                notifySlack(
                    `YOU FAIL ME YET AGAIN, STARSCREAM.
                    
                    Deploy failed *${title}* platform: (*${config.platform}*) version: *${version}* to *Firebase*:
                    
                    ${error}`,
                    config
                ).then(() => reject(error))
            );
    });

export { androidFirebaseDeploy };
