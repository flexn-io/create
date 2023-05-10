---
sidebar_position: 2
---

# Application

In this chapter we will quickly cover the state management of your application and also add a few utility hooks, that help unify different navigation structures.

## State management

You might be familiar with a lot of tools for that already like Redux, Recoil, Rematch or anything else, however this application is meant to be a simple template without too much of external dependencies, which users may or may not be familiar with, therefore we will stick with the most simple solution for state management, which already comes built in with React - Context API.

We will be managing theme and the thing that depends upon it - the styles, therefore lets define a simple implementation of Context API at the bottom of `src/config.tsx` (you need to create this file if you haven't already):

```typescript
const lightStyleSheet = createStyleSheet(staticThemes.light);
const darkStyleSheet = createStyleSheet(staticThemes.dark);

const themes = {
    light: {
        static: { ...staticThemes.light },
        styles: lightStyleSheet.styles,
        ids: lightStyleSheet.ids,
    },
    dark: {
        static: { ...staticThemes.dark },
        styles: darkStyleSheet.styles,
        ids: darkStyleSheet.ids,
    },
};

type ThemeContextType = {
    theme: Theme;
    dark: boolean;
    toggle?: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({ theme: themes.dark, dark: true });

export function ThemeProvider({ children }) {
    const [dark, setDark] = useState<ThemeContextType['dark']>(false);

    const toggle = () => {
        const isDark = !dark;
        setDark(isDark);
    };

    const theme = dark ? themes.dark : themes.light;

    return <ThemeContext.Provider value={{ theme, dark, toggle }}>{children}</ThemeContext.Provider>;
}
```

With this snippet above we're missing the type definition, therefore in a separate `config.types.ts` file lets defined the types we need and import them:

```typescript
import { ImageStyle, StatusBarStyle, TextStyle, ViewStyle } from 'react-native';

export type StaticTheme = {
    primaryFontFamily?: string;
    iconSize: number;
    buttonSize: number;
    menuWidth: number;
    menuHeight: number;
    colorLight?: string;
    colorBrand: string;
    colorBgPrimary: string;
    colorTextPrimary: string;
    colorTextSecondary: string;
    colorBorder: string;
    statusBar: StatusBarStyle;
};

export type ApplicationStyles = {
    app: ViewStyle;
    appContainer: ViewStyle;
    container: ViewStyle;
    modalContainer: ViewStyle;
    textH1: TextStyle;
    textH2: TextStyle;
    textH3: TextStyle;
    text: TextStyle;
    icon: ViewStyle;
    button: ViewStyle;
    buttonText: TextStyle;
    screen: ViewStyle;
    screenModal: ViewStyle;
    headerTitle: TextStyle;
    header: ViewStyle;
    modalHeader: ViewStyle;
    image: ImageStyle;
    menuContainer: ViewStyle;
    menuButton: ViewStyle;
    recycler: ViewStyle;
    recyclerItem: ViewStyle;
    sideMenuContainerAnimation: ViewStyle;
    menuButtonText: TextStyle;
    recyclerContent: ViewStyle;
    recyclerContainer: ViewStyle;
    burgerMenuBtn: ViewStyle;
    menuContainerBurgerOpen: ViewStyle;
    menuItemsBurgerOpen: ViewStyle;
    detailsInfoContainer: ViewStyle;
    menuItems: ViewStyle;
    center: ViewStyle;
    detailsTitle: TextStyle;
    recyclerItemText: TextStyle;
};

export type RNMQIDS = {
    menuContainer: string;
    burgerMenuBtn: string;
    menuContainerBurgerOpen: string;
    menuItemsBurgerOpen: string;
    menuItems: string;
};

export type Theme = {
    static: StaticTheme;
    styles: ApplicationStyles;
    ids: RNMQIDS;
};
```

Great! Now we have our context, all that's left is to wrap our application with it and then we can use it in any component:

```typescript
import React from 'react';
import { ThemeProvider } from '../config';
import Navigation from '../navigation';

const App = () => (
    <ThemeProvider>
        <Navigation />
        <Debugger />
    </ThemeProvider>
);

export default App;
```

Only one final step remains before our application file is ready - TV Focus (you can read about it more [here](../../guides/focus-manager)). Briefly, we will need a HOC (higher order component), which handles all the press, swipe events coming from a remote controller and initializes tracking of focusable and currently focused items. To do that, just import the App from SDK and wrap your application with it:

```typescript
import React from 'react';
import { App, Debugger } from '@flexn/create';
import { ThemeProvider } from '../config';
import Navigation from '../navigation';

const MyApp = () => (
    <ThemeProvider>
        <App style={{ flex: 1 }}>
            <Navigation />
            <Debugger />
        </App>
    </ThemeProvider>
);

export default MyApp;
```

## Hooks

There are a few navigation hooks needed for a better multiplatform experience as web and native platforms use different libraries for it. Lets start with defining what we need - hooks for the most common navigation methods, which should be familiar if you have used React Navigation before:

-   `useNavigate`, which pushes another screen in stack if it's not already in it, otherwise goes back to it;
-   `usePop`, pops the last entry of the stack;
-   `useReplace`, replaces the last entry of the stack with a new screen;
-   `useOpenDrawer`, dispatches a navigation event, which triggers drawer to open (mocked on web);
-   `useOpenUrl`, opens a URL link in a browser (except for TV platforms);

Most platforms will call the general `hooks/navigation/index.ts` file as we use React Navigation for most of the platforms:

```typescript
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import { isPlatformIos, isPlatformAndroid, isPlatformMacos } from '@rnv/renative';

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

export { useFocusEffect, useNavigation };
```

As a second step, we need to create a file for web - `hooks/navigation/index.web.ts`, which exports the same hooks, but with different logic:

```typescript
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
```

Finally, lets create our general hooks export file - `hooks/index.ts`, where you would be exporting not just the navigation hooks, but other, that you may need to customize to match the needs of your application:

```typescript
export {
    useFocusEffect,
    useNavigate,
    usePop,
    useOpenDrawer,
    useOpenURL,
    useReplace,
    useNavigation,
} from './navigation';
```
