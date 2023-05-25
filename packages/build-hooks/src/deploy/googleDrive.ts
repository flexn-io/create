/* eslint-disable max-statements */
import { Common, Logger } from 'rnv';
import { notifySlack } from '../slackNotifier';

const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const child_process = require('child_process');

const { logSuccess, logError } = Logger;

// eslint-disable-next-line no-underscore-dangle
const _googleDriveDeploy = async (config: any, driveRoot: string, binaryPath: string, targetName: string) => {
    try {
        const cnfPrivatePath = config.paths.workspace.project;
        const ROOT_FOLDER = driveRoot;

        const PATH_TO_CREDENTIALS = path.resolve(`${cnfPrivatePath.dir}/gdrive_uploader_credentials.json`);
        const PATH_TO_TOKEN = path.resolve(`${cnfPrivatePath.dir}/gdrive_uploader_token.json`);

        const credentials = JSON.parse(fs.readFileSync(PATH_TO_CREDENTIALS));

        const { client_secret, client_id, redirect_uris } = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

        const token = fs.readFileSync(PATH_TO_TOKEN);

        oAuth2Client.setCredentials(JSON.parse(token));

        const title = Common.getConfigProp(config, config.platform, 'title');
        const appPath = path.join(config.paths.project.builds.dir, `${config.runtime.appId}_${config.platform}`);
        const apkPath = `${path.join(appPath, binaryPath)}`;
        const { version } = config.files.project.package;

        logSuccess(`Deployment started for ${title}`);

        const drive = google.drive({ version: 'v3', auth: oAuth2Client });
        const { data } = await drive.files.list({
            pageSize: 999,
            fields: 'nextPageToken, files(id, name)',
            q: `'${ROOT_FOLDER}' in parents and trashed=false`,
        });

        if (data) {
            let currentFolder = data.files.find((folder: any) => folder.name === version);

            if (!currentFolder) {
                currentFolder = await drive.files.create({
                    resource: {
                        name: version,
                        mimeType: 'application/vnd.google-apps.folder',
                        parents: [ROOT_FOLDER],
                    },
                    fields: 'id',
                });
                currentFolder.id = currentFolder.data.id;
            } else {
                const { data } = await drive.files.list({
                    pageSize: 999,
                    fields: 'nextPageToken, files(id, name)',
                    q: `'${currentFolder.id}' in parents and trashed=false`,
                });

                if (data) {
                    // NOTE: for some reasoing looping in async for doesn't work here
                    // and so far we don't have a case when there is more than 3 files, so syntax below do the job
                    if (data.files[0]?.id) await drive.files.delete({ fileId: data.files[0].id });
                    if (data.files[1]?.id) await drive.files.delete({ fileId: data.files[1].id });
                    if (data.files[2]?.id) await drive.files.delete({ fileId: data.files[2].id });
                }
            }

            if (config.platform === 'macos') {
                child_process.execSync(
                    `hdiutil create -volname "${title}" -srcfolder "${apkPath}" -ov -format UDZO "${title}.dmg"`,
                    { cwd: path.join(appPath, 'release') }
                );
            } else {
                child_process.execSync(`zip "${title}.zip" "${targetName}"`, {
                    cwd: path.join(appPath, 'app/build/outputs/apk/release'),
                });
            }

            await drive.files.create({
                resource: {
                    name: config.platform === 'macos' ? targetName : `${title}.zip`,
                    parents: [currentFolder.id],
                },
                media: {
                    mimeType: 'application/octet-stream',
                    body: fs.createReadStream(
                        config.platform === 'macos'
                            ? path.join(appPath, `release/${title}.dmg`)
                            : path.join(appPath, `app/build/outputs/apk/release/${title}.zip`)
                    ),
                },
            });

            await notifySlack(
                `Deployed *${title}* (*${config.platform}*) *v${version}* to https://drive.google.com/drive/folders/${currentFolder.id}`,
                config
            );
            logSuccess('Binaries uploaded to google drive succesfully!');
        }
    } catch (e) {
        if (e instanceof Error) {
            logError(`Binary upload to google drive failed with error ${e.toString()}`);
            throw e;
        }
    }
};

const googleDriveDeploy = async (c: {
    platform: string;
    buildConfig: {
        id?: string;
    };
}) => {
    const driveRoot = Common.getConfigProp(c, c.platform, 'googleDriveFolderID');
    switch (c.platform) {
        case 'firetv':
            return _googleDriveDeploy(c, driveRoot, 'app/build/outputs/apk/release/app-release.apk', 'app-release.apk');
        case 'macos': {
            const title = 'RNVApp'; //TODO catalyst ignores title set in build schemes
            return _googleDriveDeploy(c, driveRoot, `release/${title}.app`, `${title}.dmg`);
        }
        default:
            Logger.logWarning(`Platform ${c.platform} not supported`);
            return Promise.resolve();
    }
};

export { googleDriveDeploy };
