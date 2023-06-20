class Logger {
    private _debuggerEnabled = false;
    private static _loggerInstance?: Logger;

    public static getInstance(): Logger {
        if (!Logger._loggerInstance) {
            Logger._loggerInstance = new Logger();
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
        if (this._debuggerEnabled) {
            console.debug(...args); // eslint-disable-line
        }
    }

    public setIsDebuggerEnabled(isDebuggerEnabled: boolean): this {
        this._debuggerEnabled = isDebuggerEnabled;

        return this;
    }
}

export default Logger.getInstance();
