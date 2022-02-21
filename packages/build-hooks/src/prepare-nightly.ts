import path from 'path';
import { Doctor, FileUtils } from 'rnv';

const { readObjectSync, writeFileSync } = FileUtils;

export const prepareNightlyBuild = async (c: any) => {
    const rootPkgFile = readObjectSync(path.join(c.paths.project.dir, '../../lerna.json'));

    const pkgFile = readObjectSync(c.paths.project.package);
    const { version } = rootPkgFile;
    const splitVersion = version.split('-');

    let semanticVersion = splitVersion[0];

    const needsMinorIncrease = splitVersion.length === 1; // if there's alpha or feat it means it's already increased
    if (needsMinorIncrease) {
        const [major, minor] = semanticVersion.split('.');
        const increasedMinor = parseInt(minor, 10) + 1;
        semanticVersion = [major, increasedMinor, '0'].join('.');
    }
    pkgFile.version = `${semanticVersion}-${c.files.project.assets.config.timestamp.slice(3, 7)}`;

    const output = Doctor.fixPackageObject(pkgFile);
    writeFileSync(c.paths.project.package, output);

    return true;
};

export const cleanupPostNightly = async (c: any) => {
    const rootPkgFile = readObjectSync(path.join(c.paths.project.dir, '../../lerna.json'));
    const { version } = rootPkgFile;
    const pkgFile = readObjectSync(c.paths.project.package);
    pkgFile.version = version;

    const output = Doctor.fixPackageObject(pkgFile);
    writeFileSync(c.paths.project.package, output);

    return true;
};
