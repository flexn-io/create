// import App from './src/app';
import { renderApp } from '@flexn/create';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import { Text, View } from 'react-native';

const NativeComponent = codegenNativeComponent('RNSScreenStackHeaderConfig', {});
const Activity = codegenNativeComponent('AndroidProgressBar', {
    interfaceOnly: true,
});

console.log('NativeComponent', NativeComponent, typeof NativeComponent);
console.log('Activity', Activity, typeof Activity);

const App = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'red' }}>
            <Text>Hello Red</Text>
            <NativeComponent />
            <Activity />
        </View>
    );
};

const Main = renderApp(App);
export default Main;
