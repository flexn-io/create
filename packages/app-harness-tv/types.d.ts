declare module '@rnv/engine-rn-tvos';
declare module 'react-native-carplay';

// export {};
declare global {
    namespace NodeJS {
        interface Global {
            HermesInternal: any;
        }
    }
}

declare module '*.png' {
    const value: any;
    export default value;
}
