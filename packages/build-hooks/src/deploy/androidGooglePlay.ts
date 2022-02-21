import path from 'path';
import { Common, Exec, Logger } from 'rnv';
import { notifySlack } from '../slackNotifier';

const androidGPDeploy = async (c: any) => {
    if (!['androidtv', 'android'].includes(c.platform)) return;

    Logger.logHook('androidDeploy', 'APK DEPLOY STARTED');
    const { version } = c.files.project.package;
    const title = Common.getConfigProp(c, c.platform, 'title');

    const appPath = path.join(c.paths.project.builds.dir, `${c.runtime.appId}_${c.platform}`);
    const aabPath = `${path.join(appPath, `app/build/outputs/bundle/release/app-release.aab`)}`;

    // const url = `https://play.google.com/apps/testing/${Common.getConfigProp(c, c.platform, 'id')}`;

    try {
        await Exec.executeAsync(
            c,
            `fastlane supply --aab ${aabPath} --track alpha --json_key ${path.join(
                c.paths.workspace.project.dir,
                'play-store-credentials.json'
            )} --package_name ${Common.getConfigProp(c, c.platform, 'id')} `,
            {
                env: process.env,
                shell: true,
                stdio: 'inherit',
                silent: true,
            }
        );
        await notifySlack(`Deployed *${title}* (*${c.platform}*) *v${version}* to Google Play Console`, c);
    } catch (err) {
        await notifySlack(
            `YOU FAIL ME YET AGAIN, STARSCREAM.
                
            Deploy failed *${title}* platform: (*${c.platform}*) version: *${version}* to *Google Play*:
                
            ${err}`,
            c
        );
    }
};

export { androidGPDeploy };
