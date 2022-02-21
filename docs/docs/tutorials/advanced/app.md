---
sidebar_position: 2
---

# Application

In this chapter we will quickly cover the state management of your application. You might be familiar with a lot of tools for that already like Redux, Recoil, Rematch or anything else, however this application is meant to be a simple template without too much of external dependencies, which users may or may not be familiar with, therefore we will stick with the most simple solution for state management, which already comes built in with React - Context API.

We will be managing theme and the thing that depends upon it - the styles, therefore lets define a simple implementation of Context API at the bottom of `config.tsx`:

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
  </ThemeProvider>
);

export default App;
```

Only one final step remains before our application file is ready - TV Focus (you can read about it more [here](../../guides/focus-manager)). Briefly, we will need a HOC (higher order component), which handles all the press, swipe events coming from a remote controller and initializes tracking of focusable and currently focused items. To do that, just import the App from SDK and wrap your application with it:

```typescript
import React from 'react';
import { App as SDKApp } from '@flexn/sdk';
import { ThemeProvider } from '../config';
import Navigation from '../navigation';

const App = () => (
  <ThemeProvider>
    <SDKApp style={{ flex: 1 }}>
      <Navigation />
    </SDKApp>
  </ThemeProvider>
);

export default App;
```
