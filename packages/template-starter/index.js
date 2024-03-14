import App from './src/app';
import { renderApp } from '@flexn/create';
// import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
// import { Text, View, NativeModules } from 'react-native';

// const NativeComponent = codegenNativeComponent('RNSScreenStackHeaderConfig', {});
// const Activity = codegenNativeComponent('AndroidProgressBar', {
//     interfaceOnly: true,
// });

// const { AndroidProgressBar, RNSScreenStackHeaderConfig } = NativeModules;

// console.log('NativeComponent', NativeComponent, typeof NativeComponent, RNSScreenStackHeaderConfig);
// console.log('Activity', Activity, typeof Activity, AndroidProgressBar);

// const App = () => {
//     return (
//         <View style={{ flex: 1, backgroundColor: 'red' }}>
//             <Text>Hello Red</Text>
//             <NativeComponent />
//             <Activity />
//         </View>
//     );
// };

const Main = renderApp(App);
export default Main;
