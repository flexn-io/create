import path from 'path';
import fs from 'fs';
import child_process from 'child_process';
import { FileUtils } from 'rnv';

const { readObjectSync } = FileUtils;

export const uploadSentryMaps = (c: any) => {
    const rootPkgFile = readObjectSync(path.join(c.paths.project.dir, '../../lerna.json'));
    const { version } = rootPkgFile;

    const args = [
        `files ${version}`,
        'upload-sourcemaps',
        `--dist ${version.replace(new RegExp(/([.,-]|alpha)/g), '')}`,
        `--strip-prefix ${path.resolve(__dirname, '..', '..', '..', '..', '..')}`,
        `--rewrite platformBuilds/${c.runtime.appId}_${c.platform}/main.jsbundle platformBuilds/${c.runtime.appId}_${c.platform}/main.jsbundle.map`,
    ];

    return child_process.exec(
        `${path.join(require.resolve('@sentry/react-native'), '..', 'cli', 'bin', 'sentry-cli')} ${args.join(' ')}`
    );
};

export const setupSentrySecrets = (c: any) => {
    const url = c.files.workspace.project?.configPrivate?.SENTRY_URL;
    fs.writeFileSync(path.join(c.paths.project.dir, 'renative.private.json'), `{"SENTRY_URL":"${url}"}`);
};
