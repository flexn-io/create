import { useFocusEffect } from '@react-navigation/native';
import { Linking } from 'react-native';
import { isPlatformIos, isPlatformAndroid, isPlatformMacos } from 'renative';

export function useNavigate({ navigation }) {
    function navigate(route: string, params?: any) {
        navigation.navigate(route, params);
    }
    return navigate;
}

export function usePop({ navigation }) {
    function pop() {
        navigation.pop();
    }
    return pop;
}

export function useReplace({ navigation }) {
    function replace(route: string) {
        if (isPlatformIos || isPlatformAndroid) {
            navigation.reset({
                index: 0,
                routes: [{ name: route }],
            });
        } else {
            navigation.navigate(route);
        }
    }
    return replace;
}

export function useOpenDrawer({ navigation }) {
    function openDrawer() {
        navigation.dispatch({ type: 'OPEN_DRAWER' });
    }
    return openDrawer;
}

export function useOpenURL() {
    async function openURL(url: string) {
        if (isPlatformIos || isPlatformAndroid || isPlatformMacos) {
            await Linking.openURL(url);
        } else {
            // error happened
        }
    }
    return openURL;
}

export { useFocusEffect };
