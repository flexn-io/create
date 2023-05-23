import { gitCommit, gitTag } from './git';
import { updateVersions } from '@flexn/build-hooks';

const hooks = {
    gitCommit,
    gitTag,
    updateVersions,
};

const pipes = {};

export { pipes, hooks };
