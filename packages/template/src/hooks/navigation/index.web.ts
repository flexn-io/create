import { Linking } from 'react-native';
import Router, { useRouter } from 'next/router';

export function useNavigate() {
    function navigate(route: string, params?: any) {
        if (params) {
            Router.push({
                pathname: route,
                query: params,
            });
        } else {
            Router.push(route, params);
        }
    }
    return navigate;
}

export function usePop() {
    function pop() {
        Router.back();
    }
    return pop;
}

export function useReplace() {
    function replace(route: string) {
        Router.replace(route);
    }
    return replace;
}

export function useOpenDrawer() {
    function openDrawer() {
        return;
    }
    return openDrawer;
}

export function useOpenURL() {
    async function openURL(url: string) {
        await Linking.openURL(url);
    }
    return openURL;
}

export function useFocusEffect() {
    return;
}

export { useRouter as useNavigation };
