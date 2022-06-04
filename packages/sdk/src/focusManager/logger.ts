let CoreManager: { isDebuggerEnabled: boolean };

const logger = {
    initialize: (CoreManagerInstance: any) => {
        CoreManager = CoreManagerInstance;
    },
    log: (...args: Array<any>) => {
        console.log(...args); // eslint-disable-line
    },
    error: (...args: Array<any>) => {
        console.error(...args); // eslint-disable-line
    },
    warn: (...args: Array<any>) => {
        console.warn(...args); // eslint-disable-line
    },
    debug: (...args: Array<any>) => {
        if (CoreManager?.isDebuggerEnabled) {
            console.debug(...args); // eslint-disable-line
        }
    },
};

export default logger;
