import { ContextProvider } from '@flexn/sdk';

export default class ContextHelper extends ContextProvider {
    constructor(uniqueKey) {
        super();
        this._contextStore = {};
        this._uniqueKey = uniqueKey;
    }

    getUniqueKey() {
        return this._uniqueKey;
    };

    save(key, value) {
        this._contextStore[key] = value;
    }

    get(key) {
        return this._contextStore[key];
    }

    remove(key) {
        delete this._contextStore[key];
    }
}