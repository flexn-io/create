import {
    updateVersions,
    cleanupPostNightly,
    prepareNightlyBuild,
    androidFirebaseDeploy,
    androidGPDeploy,
    googleDriveDeploy,
    iosFirebaseDeploy,
    iosTFDeploy,
    vercelDeploy,
} from '@flexn/build-hooks';

const deploy = (c) => {
    switch (c.platform) {
        case 'ios':
            return iosFirebaseDeploy(c);
        case 'tvos':
            return iosTFDeploy(c);
        case 'android':
            return androidFirebaseDeploy(c);
        case 'androidtv':
            return androidGPDeploy(c);
        case 'macos':
        case 'firetv':
            return googleDriveDeploy(c);
        case 'web':
        case 'chromecast':
            return vercelDeploy(c);
        default:
            return Promise.resolve();
    }
};

const hooks = {
    prepareNightlyBuild,
    cleanupPostNightly,
    updateVersions,
    deploy,
};

const pipes = {
    'deploy:after': hooks.deploy,
};

export { pipes, hooks };
