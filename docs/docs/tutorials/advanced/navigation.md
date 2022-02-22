---
sidebar_position: 3
---

# Navigation

Once we have screens ready it's time to construct proper navigation which can behave on any OS and form factor. 
In this chapter we're going to cover how to build simple navigation which works on: web, TV and mobile.

For Flexn Template we choose to use [react-navigation](https://reactnavigation.org/). Navigation is one of the most non platform agnostic parts in the whole application.
Each platform has it's own navigation structure, navigational paradigms, components, UI. Because of that we're going differentiate different platform/form factor per separate files as following:

- `index.chromecast.tsx` - defines navigation which is only for chromecast
- `index.desktop.tsx` - defines navigation which is only for macos
- `index.tv.native.tsx` - defines navigation which is only for Android TV, Fire TV and Apple TV
- `index.tsx` - defines navigation which would be applied for all platforms which is not mentioned above, but in our app it defined mobile(ios, android) navigation

There is one exception. As you can see there is no specific file for web. According to order described above `index.tsx` should handle it, but that's not the case.
Since in our template as an web engine we're using [next.js](https://nextjs.org/) we're also have to apply rules which works for next.js. More about that [Web navigation](#web-navigation)

## Mobile navigation

First let's start from most common one - mobile. Let's create first file at `src/navigation/index.tsx`. For mobile we choose to have [Drawer navigation](https://reactnavigation.org/docs/drawer-based-navigation). It has very common use case of ReactNavigation without any specificness. We're utilizing multiple different stacks to achieve following functionality:

We're putting `Modal` out of our `DrawerNavigator` because regardless in which page we are we would like to be able to render Modal always on the top independently.
```javascript
import React, { useContext, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { CastButton } from 'react-native-google-cast';
import ScreenHome from '../screens/home';
import ScreenCarousels from '../screens/carousels';
import ScreenDetails from '../screens/details';
import ScreenModal from '../screens/modal';
import Menu, { DrawerButton } from '../components/menu';
import { ROUTES, ThemeContext } from '../config';

const ModalStack = createStackNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const CarouselsStack = () => (
  // implementation in next example
);

const DrawerNavigator = ({ navigation }) => {
  // implementation in next example
};

const App = () => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    StatusBar.setBarStyle(theme.static.statusBar);
    StatusBar.setBackgroundColor(theme.static.colorBgPrimary);
  }, [theme?.static]);

  return (
    <NavigationContainer>
      <ModalStack.Navigator
        headerMode="none"
        mode="modal"
        screenOptions={{
          cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
        }}
      >
        <ModalStack.Screen name="drawer" component={DrawerNavigator} />
        <ModalStack.Screen name={ROUTES.MODAL} component={ScreenModal} />
      </ModalStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
```

DrawerNavigator contains rest of our navigational screens. But as you can see instead of putting `ScreenCarousels` and `ScreenDetails` details directly into `Drawer.Navigator` we're creating separate stack for it. The reason for it to create a proper stack history so in this case when we're opened `ScreenDetails` we can navigate back to  `ScreenCarousels` as we expect to.

```javascript
const CarouselsStack = () => (
  <Stack.Navigator headerMode="none">
    <Stack.Screen name={ROUTES.CAROUSELS} component={ScreenCarousels} />
    <Stack.Screen name={ROUTES.DETAILS} component={ScreenDetails} />
  </Stack.Navigator>
);

const DrawerNavigator = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <Menu {...props} />}
      screenOptions={{
        headerLeft: () => <DrawerButton navigation={navigation} />,
        headerTitleStyle: theme.styles.headerTitle,
        headerStyle: theme.styles.header,
        headerShown: true,
      }}
    >
      <Drawer.Screen
        name={ROUTES.HOME}
        component={ScreenHome}
        options={{
          headerRight: () => (
            <CastButton
              style={{
                width: theme.static.iconSize,
                height: theme.static.iconSize,
                tintColor: theme.static.colorBrand,
              }}
            />
          ),
        }}
      />
      <Drawer.Screen name={ROUTES.CAROUSELS} component={CarouselsStack} />
    </Drawer.Navigator>
  );
};
```



## Desktop navigation

The next is desktop navigation create a file called `src/navigation/index.desktop.tsx`. Desktop navigation is even more simpler, but instead of Drawer and separate stacks we're using custom menu and single stack to hold all navigational pages:

```javascript
import React, { useContext, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { View } from '@flexn/sdk';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import ScreenHome from '../screens/home';
import ScreenCarousels from '../screens/carousels';
import ScreenDetails from '../screens/details';
import ScreenModal from '../screens/modal';
import Menu from '../components/menu';
import { ThemeContext, ROUTES } from '../config';

const Stack = createStackNavigator();
const RootStack = createStackNavigator();

const StackNavigator = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <Menu navigation={navigation} />
      <Stack.Navigator
        screenOptions={{
          headerTitleStyle: theme.styles.headerTitle,
          headerStyle: theme.styles.header,
          cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
        }}
      >
        <Stack.Screen name={ROUTES.HOME} component={ScreenHome} />
        <Stack.Screen name={ROUTES.CAROUSELS} component={ScreenCarousels} />
        <Stack.Screen name={ROUTES.DETAILS} component={ScreenDetails} />
      </Stack.Navigator>
    </View>
  );
};

const App = () => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    StatusBar.setBarStyle(theme.static.statusBar);
  }, []);

  return (
    <View style={{ marginTop: 36, flex: 1 }}>
      <NavigationContainer>
        <RootStack.Navigator
          headerMode="none"
          mode="modal"
          screenOptions={{
            cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
          }}
        >
          <RootStack.Screen name="stack" component={StackNavigator} />
          <RootStack.Screen name={ROUTES.MODAL} component={ScreenModal} />
        </RootStack.Navigator>
      </NavigationContainer>
    </View>
  );
};

export default App;
```

## Native TV navigation

The next is TV `index.tv.native.tsx`. Native TV navigation is exceptional because for that we have created our custom `SideNavigator`. The reason of this choice is because all react navigation defaults like Drawer doesn't work well on TV and are very flaky. There are few important parts which we need to know here. 

As you can see we're using `createNativeStackNavigator` instead if `createStackNavigator`. Native Stack Navigator offers native performance and are better designed to work with react-native-screens which is required for TV navigation to work. 

```javascript
import React, { useEffect, useCallback } from 'react';
import { View } from '@flexn/sdk';
import { TVMenuControl, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  NavigationContainer,
  useNavigationBuilder,
  StackActions,
  StackRouter,
  createNavigatorFactory,
} from '@react-navigation/native';
import { screensEnabled } from 'react-native-screens';
import { isPlatformTvos } from 'renative';
import { ScreenContainer } from 'react-native-screens'; //eslint-disable-line
import ResourceSavingScene from '@react-navigation/drawer/src/views/ResourceSavingScene';

import ScreenHome from '../screens/home';
import ScreenCarousels from '../screens/carousels';
import ScreenDetails from '../screens/details';
import ScreenModal from '../screens/modal';
import Menu from '../components/menu';
import { ROUTES } from '../config';

const createTVSideNavigator = createNavigatorFactory(Navigator);

function Navigator({ initialRouteName, children, screenOptions, drawerContent, ...rest }) {
  // implementation in next example
}

const RootStack = createNativeStackNavigator();
const SideNavigatorStack = createTVSideNavigator();

const SideNavigator = () => (
  <SideNavigatorStack.Navigator
    drawerContent={({ navigation }: { navigation: any }) => <Menu navigation={navigation} />}
  >
    <SideNavigatorStack.Screen name={ROUTES.HOME} component={ScreenHome} />
    <SideNavigatorStack.Screen name={ROUTES.CAROUSELS} component={ScreenCarousels} />
    <SideNavigatorStack.Screen name={ROUTES.DETAILS} component={ScreenDetails} />
  </SideNavigatorStack.Navigator>
);

const App = () => (
  <NavigationContainer>
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="stack" component={SideNavigator} />
      <RootStack.Screen name={ROUTES.MODAL} component={ScreenModal} />
    </RootStack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 2,
    opacity: 1,
    position: 'absolute',
  },
  content: { flex: 1 },
  main: { flex: 1 },
});

export default App;
```

For SideNavigator we have created our own navigator which is simple enough, but at the same time are optimized to work on Native TV. What SideNavigator does essentially is very similar to Drawer. It keeps SideMenu always visible on the left side and at the same time rendering the content. The main difference is that in this case we're using react-native-screens and also we're able to define our own menu container which has proper focus handling. 

```javascript
function Navigator({ initialRouteName, children, screenOptions, drawerContent, ...rest }) {
  if (!screensEnabled()) {
    throw new Error('Native stack is only available if React Native Screens is enabled.');
  }

  const { state, navigation, descriptors } = useNavigationBuilder(StackRouter, {
    initialRouteName,
    children,
    screenOptions,
  });

  const tabPressEventHandler = useCallback(() => {
    const isFocused = navigation.isFocused();
    requestAnimationFrame(() => {
      if (state.index > 0 && isFocused) {
        navigation.dispatch({
          ...StackActions.popToTop(),
          target: state.key,
        });
      }
    });
  }, [navigation, state.index, state.key]);

  useEffect(() => {
    if (isPlatformTvos) {
      TVMenuControl.enableTVMenuKey();
      if (state.index === 0) {
        TVMenuControl.disableTVMenuKey();
      }
    }

    navigation.addListener('tabPress', tabPressEventHandler);
    return () => navigation.removeListener('tabPress', tabPressEventHandler);
  }, [navigation, state.index, tabPressEventHandler]);

  const renderContent = () => (
    <ScreenContainer style={styles.content}>
      {state.routes.map((route, index) => {
        const descriptor = descriptors[route.key];
        const { unmountOnBlur } = descriptor.options;
        const isFocused = state.index === index;

        if (unmountOnBlur && !isFocused) {
          return null;
        }

        return (
          <ResourceSavingScene
            key={route.key}
            style={[StyleSheet.absoluteFill, { opacity: isFocused ? 1 : 0 }]}
            isVisible={isFocused}
            enabled
          >
            {descriptor.render()}
          </ResourceSavingScene>
        );
      })}
    </ScreenContainer>
  );

  const renderDrawerView = () =>
    drawerContent({
      state,
      navigation,
      descriptors,
      ...rest,
    });

  return (
    <View style={styles.main}>
      <View style={[styles.container]}>{renderDrawerView()}</View>
      <View style={[styles.content]}>{renderContent()}</View>
    </View>
  );
}
```
## Web navigation

Web navigation is very different than others. Since it does not utilize react-navigation but instead of it's based on next.js navigational paradigms. As you can see there is no single file which would define how navigation structure for the web looks like. Instead of that we're folders structure itself which in next.js is definition of the page.

Let's create a files as following. 

First `pages/index.tsx`. As you can guess it holds our home page.

```javascript
import React from 'react';
import ScreenHome from '../screens/home';

const Page = () => <ScreenHome />;
export default Page;
```

Next is `pages/[slug]/index.tsx`. By having `[slug]` as folder name we can capture rest of our urls and map them as following:

```javascript
import React from 'react';
import { useRouter } from 'next/router';
import Error from 'next/error';
import ScreenHome from '../../screens/home';
import ScreenCarousels from '../../screens/carousels';
import ScreenDetails from '../../screens/details';
import ScreenModal from '../../screens/modal';
import { ROUTES } from '../../config';

type NavigationScreenKey = '/' | 'modal' | 'my-page';

const pages = {
  [ROUTES.HOME]: ScreenHome,
  [ROUTES.CAROUSELS]: ScreenCarousels,
  [ROUTES.DETAILS]: ScreenDetails,
  [ROUTES.MODAL]: ScreenModal,
};

const App = () => {
  const router = useRouter();

  const Page = pages[router.query?.slug as NavigationScreenKey];

  if (!Page) {
    return <Error statusCode={404} />;
  }

  return <Page key={router.asPath} router={router} route={router.query?.slug} />;
};

export default App;
```

And finally in `pages/_app.tsx` we are defining our top menu:

```javascript
import React from 'react';
import { View } from '@flexn/sdk';
import Menu from '../components/menu';
import { themeStyles, ThemeProvider } from '../config';

export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Menu />
      <View style={themeStyles.appContainer}>
        <Component {...pageProps} />
      </View>
    </ThemeProvider>
  );
}
```
## Chromecast navigation

And finally most simplistic is chromecast navigation which is holding only on page to render text in casting device. It can be defined as simple as `navigation/index.chromecast.tsx`:

```javascript
import React from 'react';
import ScreenCast from '../screens/cast';

const App = () => <ScreenCast />;

export default App;
```