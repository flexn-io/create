/* eslint-disable no-console */
import { Common, Exec } from 'rnv';
import { notifySlack } from '../slackNotifier';

const path = require('path');

const iosTFDeploy = async (c: any) => {
    let fastlaneArguments: string[] = [];

    const privateConfig = c.files.workspace.project?.configPrivate || {};
    const appleId =
        c.runtime.scheme === 'canary' ? privateConfig.apple.alpha_apple_id : privateConfig.apple.prod_apple_id;
    const basePath = Common.getAppFolder(c, c.platform);
    const ipaPath = `${basePath}/release/${c.platform === 'tvos' ? 'RNVAppTVOS.ipa' : 'RNVApp.ipa'}`;
    const platformId = c.platform === 'tvos' ? 'appletvos' : 'ios';
    const title = Common.getConfigProp(c, c.platform, 'title');
    const teamId = Common.getConfigProp(c, c.platform, 'teamID');
    const appId = Common.getConfigProp(c, c.platform, 'id');

    const version = Common.getConfigProp(c, c.platform, 'version', c.files.project.package.version);
    // const url = `https://appstoreconnect.apple.com/WebObjects/iTunesConnect.woa/ra/ng/app/${testFlightId}/testflight?section=iosbuilds`;
    const url = `https://appstoreconnect.apple.com/apps/${appleId}/testflight/${c.platform}`;
    fastlaneArguments = [
        'run',
        'upload_to_testflight',
        `app_identifier:${appId}`,
        `app_platform:${platformId}`,
        `team_id:${teamId}`,
        `ipa:${ipaPath}`,
        `apple_id:${appleId}`,
        'skip_waiting_for_build_processing:true',
        `api_key_path:${path.join(c.paths.workspace.project.dir, 'app_store_connect_credentials.json')}`,
    ];

    console.log(`Fastlane ${c.platform} upload to AppStore started for ${ipaPath}`);

    try {
        await Exec.executeAsync(c, `fastlane ${fastlaneArguments.join(' ')}`, {
            env: process.env,
            shell: true,
            stdio: 'inherit',
            silent: true,
        });

        await notifySlack(`Deployed *${title}* (*${c.platform}*) *v${version}* to Testflight - ${url}`, c);
    } catch (e) {
        await notifySlack(
            `YOU FAIL ME YET AGAIN, STARSCREAM.

            Deploy failed *${title}* (*${c.platform}*) *v${version}* to Testflight:

            ${e}`,
            c
        );
    }
};

export { iosTFDeploy };
