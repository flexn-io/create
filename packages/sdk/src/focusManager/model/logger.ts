class Logger {
    private _coreManager: any;
    private static _loggerInstance?: Logger;

    constructor(CoreManagerInstance: any) {
        this._coreManager = CoreManagerInstance;
    }

    public static getInstance(CoreManagerInstance?: any): Logger {
        if (!Logger._loggerInstance) {
            Logger._loggerInstance = new Logger(CoreManagerInstance);
        }

        return Logger._loggerInstance;
    }

    public log(...args: Array<any>) {
        console.log(...args); // eslint-disable-line
    }

    public error(...args: Array<any>) {
        console.error(...args); // eslint-disable-line
    }

    public warn(...args: Array<any>) {
        console.warn(...args); // eslint-disable-line
    }

    public debug(...args: Array<any>) {
        if (this._coreManager?.isDebuggerEnabled) {
            console.debug(...args); // eslint-disable-line
        }
    }
}

export default Logger;
