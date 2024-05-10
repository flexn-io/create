import path from 'path';
import { logHook, readObjectSync } from '@rnv/core';
import simpleGit from 'simple-git';

export const gitCommit = async (c) => {
    const baseDir = c.paths.project.dir;

    const rootPkgFile = readObjectSync(path.join(baseDir, 'lerna.json'));

    const { version } = rootPkgFile;

    logHook(`gitCommitAndTagVersion ${version}`);
    const git = simpleGit({ baseDir });
    logHook('adding files');
    await git.add(`${baseDir}/*`);
    logHook('COMMITING...');
    await git.commit(`chore(release): publish ${version}`);
    logHook('DONE');
    return true;
};

export const gitTag = async (c) => {
    const baseDir = c.paths.project.dir;

    const rootPkgFile = readObjectSync(path.join(baseDir, 'lerna.json'));
    const { version } = rootPkgFile;

    logHook(`gitTagAndPush ${version}`);
    const git = simpleGit({ baseDir });
    await git.addTag(`${version}`);
    await git.push();
    await git.pushTags();
    return true;
};
