import path from 'path';
import { FileUtils, Logger } from 'rnv';
import simpleGit from 'simple-git';

const { readObjectSync } = FileUtils;

export const gitCommit = async (c) => {
    const baseDir = c.paths.project.dir;

    const rootPkgFile = readObjectSync(path.join(baseDir, 'lerna.json'));

    const { version } = rootPkgFile;

    Logger.logHook(`gitCommitAndTagVersion v${version}`);
    const git = simpleGit({ baseDir });
    Logger.logHook('adding files');
    await git.add(`${baseDir}/*`);
    Logger.logHook('COMMITING...');
    await git.commit(`chore(release): publish ${version}`);
    Logger.logHook('DONE');
    return true;
};

export const gitTag = async (c) => {
    const baseDir = c.paths.project.dir;

    const rootPkgFile = readObjectSync(path.join(baseDir, 'lerna.json'));
    const { version } = rootPkgFile;

    Logger.logHook(`gitTagAndPush v${version}`);
    const git = simpleGit({ baseDir });
    await git.addTag(`v${version}`);
    await git.push();
    await git.pushTags();
    return true;
};
