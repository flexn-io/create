---
sidebar_position: 3
---

# Screens

Let's start filling content of our application. Flexn Template contains several platform agnostics screens which means the same file is rendered on all the platforms.

## Abstracted screen

First let's create an abstracted screen wrapper which will hold logic repeated over each screen. In `src/screens` folder create file called `screens.tsx` and fill with the following content:

```javascript
import { Screen as FMScreen, ScreenProps, ScreenStates } from '@flexn/sdk';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '../hooks';

const Screen = ({ children, stealFocus, focusOptions, style, ...rest }: ScreenProps) => {
  const [screenState, setScreenState] = useState < ScreenStates > 'foreground';

  useFocusEffect(
    useCallback(() => {
      setScreenState('foreground');

      return () => {
        setScreenState('background');
      };
    }, [])
  );

  return (
    <FMScreen screenState={screenState} stealFocus={stealFocus} focusOptions={focusOptions} style={style} {...rest}>
      {children}
    </FMScreen>
  );
};

export default Screen;
```

We are using [Screen](../../components/screen.mdx) component to wrap every template screen and by utilizing `useFocusEffect` hook setting state of the screen whatever screen is in background or foreground. It's worth to mention that [Screen](../../components/screen.mdx) functionality is applied only for TV platforms for the rest behind the scenes it's only simple React Native View.

## Home screen

It's a good practice to start from Home screen. Create a new file called `src/screens/home.tsx` and copy over the code below:

```javascript
import React, { useContext, useRef } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Image } from '@flexn/sdk';
import { Api } from '@rnv/renative';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ROUTES, ICON_LOGO, ThemeContext } from '../config';
import { useNavigate, useOpenURL } from '../hooks';
import { testProps } from '../utils';
import Screen from './screen';
import packageJson from '../../package.json';

const ScreenHome = ({ navigation }: { navigation?: any }) => {
  const swRef = useRef<ScrollView>() as React.MutableRefObject<ScrollView>;
  const navigate = useNavigate({ navigation });
  const openURL = useOpenURL();

  const { theme, toggle } = useContext(ThemeContext);

  const focusAnimation = {
    type: 'background_color',
    colorFocus: theme.static.colorBrand,
    colorBlur: theme.static.colorBgPrimary,
  };

  return (
    <Screen style={theme.styles.screen} focusOptions={{ verticalWindowAlignment: 'both-edge' }}>
      <ScrollView
        style={{ backgroundColor: theme.static.colorBgPrimary }}
        ref={swRef}
        contentContainerStyle={theme.styles.container}
      >
        <Image style={theme.styles.image} source={ICON_LOGO} />
        <Text style={theme.styles.textH1}>{'Flexn SDK Example'}</Text>
        <Text style={theme.styles.textH2}>v {packageJson.version}</Text>
        <Text style={theme.styles.textH3}>{`platform: ${Api.platform}`}</Text>
        <Text style={theme.styles.textH3}>{`factor: ${Api.formFactor}`}</Text>
        <Text style={theme.styles.textH3}>{`engine: ${Api.engine}`}</Text>
        <TouchableOpacity
          onPress={toggle}
          onFocus={() => {
            if (swRef.current) swRef.current.scrollTo({ y: 0 });
          }}
          style={theme.styles.button}
          focusOptions={{
            animatorOptions: focusAnimation,
            forbiddenFocusDirections: ['up'],
          }}
          {...testProps('template-screen-home-try-me-button')}
        >
          <Text style={theme.styles.buttonText}>Try Me!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigate(ROUTES.CAROUSELS)}
          style={theme.styles.button}
          focusOptions={{
            animatorOptions: focusAnimation,
          }}
          {...testProps('template-screen-home-now-try-me-button')}
        >
          <Text style={theme.styles.buttonText}>Now Try Me!</Text>
        </TouchableOpacity>
        <Text style={[theme.styles.textH3, { marginTop: 20 }]}>Explore more</Text>
        <View style={{ marginTop: 10, flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => openURL('https://github.com/flexn-io/flexn')}
            style={theme.styles.icon}
            focusOptions={{
              forbiddenFocusDirections: ['left'],
            }}
            {...testProps('template-screen-home-navigate-to-github')}
          >
            <Icon name="github" size={theme.static.iconSize} color={theme.static.colorBrand} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openURL('https://sdk.flexn.org')}
            style={theme.styles.icon}
            {...testProps('template-screen-home-navigate-to-renative')}
          >
            <Icon name="chrome" size={theme.static.iconSize} color={theme.static.colorBrand} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openURL('https://twitter.com/flexn_io')}
            style={theme.styles.icon}
            focusOptions={{
              forbiddenFocusDirections: ['right'],
            }}
            {...testProps('template-screen-home-navigate-to-twitter')}
          >
            <Icon name="twitter" size={theme.static.iconSize} color={theme.static.colorBrand} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
};

export default ScreenHome;
```

## Carousels screen

One of the most dynamic screens in whole template. Let's add several rows with some nice images inside. First let's create a file `src/utils/index.ts` and write a function which generates a random data for us:

```javascript
import { isFactorMobile } from '@rnv/renative';

const kittyNames = ['Abby', 'Angel', 'Annie', 'Baby', 'Bailey', 'Bandit'];

function interval(min = 0, max = kittyNames.length - 1) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = {};
export function getRandomData(row: number, idx?: number, items = 50) {
  const width = isFactorMobile ? 400 : 650;
  const height = 200;

  if (data[row] && idx !== undefined) {
    return data[row][idx];
  }

  const temp: { backgroundImage: string, title: string, index: number }[] = [];
  for (let index = 0; index < items; index++) {
    temp.push({
      index,
      backgroundImage: `https://placekitten.com/${width + row}/${height + index}`,
      title: `${kittyNames[interval()]} ${kittyNames[interval()]} ${kittyNames[interval()]}`,
    });
  }

  data[row] = temp;

  return temp;
}
```

Next create a file `src/screens/carousels.tsx`. There define screen layout define sizes of ours rows based on the platform and start filling array with data:

```javascript
import {
  Image,
  TouchableOpacity,
  RecyclableList,
  RecyclableListDataProvider,
  RecyclableListLayoutProvider,
  View,
  ScrollView,
  Text,
} from '@flexn/sdk';
import { testProps } from '../utils';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { isFactorMobile } from '@rnv/renative';
import { Ratio, ThemeContext, ROUTES } from '../config';
import { useNavigate } from '../hooks';
import { getRandomData } from '../utils';
import Screen from './screen';

const { width } = Dimensions.get('window');
const MARGIN_GUTTER = Ratio(20);

const itemsInRows = [
  [1, 3],
  [2, 4],
  [3, 5],
  [4, 6],
  [2, 4],
  [3, 5],
];

function getRecyclerDimensions(itemsInViewport: number) {
  return {
    layout: { width: width / itemsInViewport, height: Ratio(270) },
    item: { width: width / itemsInViewport - MARGIN_GUTTER, height: Ratio(250) },
  };
}

const RecyclerExample = ({ items, rowNumber, dimensions: { layout, item }, parentContext, navigation }: any) => {
  // implementation in next example
};

const ScreenCarousels = ({ navigation }: { navigation?: any }) => {
  const { theme } = useContext(ThemeContext);
  const [recyclers, setRecyclers] = useState<
    {
      items: any;
      dimensions: {
        layout: {
          width: number;
          height: number;
        };
        item: {
          width: number;
          height: number;
        };
      };
    }[]
  >([]);

  useEffect(() => {
    setRecyclers(
      itemsInRows.map(([smallScreenItems, bigScreenItems], rowNumber) => ({
        dimensions: getRecyclerDimensions(isFactorMobile ? smallScreenItems : bigScreenItems),
        items: getRandomData(rowNumber),
      }))
    );
  }, []);

  const renderRecyclers = () =>
    recyclers.map((recyclerInfo, i) => (
      <RecyclerExample key={i} rowNumber={i} navigation={navigation} {...recyclerInfo} />
    ));

  return (
    <Screen style={theme.styles.screen}>
      <ScrollView>{renderRecyclers()}</ScrollView>
    </Screen>
  );
};

export default ScreenCarousels;
```

Finally add function which is rendering our carousels:

```javascript
const RecyclerExample = ({ items, rowNumber, dimensions: { layout, item }, parentContext, navigation }: any) => {
  const navigate = useNavigate({ navigation });
  const { theme } = useContext(ThemeContext);

  const [dataProvider] = useState(
    new RecyclableListDataProvider((r1: number, r2: number) => r1 !== r2).cloneWithRows(items)
  );

  const layoutProvider = useRef(
    new RecyclableListLayoutProvider(
      () => '_',
      (_: string | number, dim: { width: number, height: number }) => {
        dim.width = layout.width;
        dim.height = layout.height;
      }
    )
  ).current;

  return (
    <View parentContext={parentContext} style={theme.styles.recyclerContainer}>
      <RecyclableList
        dataProvider={dataProvider}
        layoutProvider={layoutProvider}
        rowRenderer={(_type: string | number, data: any, index: number, repeatContext: any) => {
          return (
            <TouchableOpacity
              style={[theme.styles.recyclerItem, { width: item.width, height: item.height }]}
              repeatContext={repeatContext}
              onPress={() => {
                navigate(ROUTES.DETAILS, { row: rowNumber, index: data.index });
              }}
              {...testProps(`template-my-page-image-pressable-${index}`)}
            >
              <Image source={{ uri: data.backgroundImage }} style={{ width: '100%', height: '80%' }} />
              <Text style={theme.styles.recyclerItemText} numberOfLines={1}>
                {data.title}
              </Text>
            </TouchableOpacity>
          );
        }}
        isHorizontal
        style={theme.styles.recycler}
        contentContainerStyle={theme.styles.recyclerContent}
        scrollViewProps={{
          showsHorizontalScrollIndicator: false,
        }}
        focusOptions={{
          forbiddenFocusDirections: ['right'],
        }}
      />
    </View>
  );
};
```

## Details screen

Next is Details screen. That's the target page when we click on any of carousel items. Let's add it at `src/screens/details.tsx` and copy code below:

```javascript
import { TouchableOpacity, ImageBackground, View, Text, ScrollView, ActivityIndicator } from '@flexn/sdk';
import React, { useContext, useState, useEffect } from 'react';
import { isPlatformWeb } from '@rnv/renative';
import { ThemeContext, ROUTES } from '../config';
import { usePop, useReplace } from '../hooks';
import { getRandomData } from '../utils';
import Screen from './screen';

const ScreenDetails = ({ route, navigation, router }: { navigation?: any; router?: any; route?: any }) => {
  const replace = useReplace({ navigation });
  const pop = usePop({ navigation });
  const [item, setItem] = useState<{ backgroundImage: string; title: string }>();
  const { theme } = useContext(ThemeContext);

  const focusAnimation = {
    type: 'border',
    colorFocus: theme.static.colorBrand,
    colorBlur: '#EEEEEE',
    borderWidth: 3,
  };

  useEffect(() => {
    const params = isPlatformWeb ? router.query : route?.params;
    setItem(getRandomData(params.row, params.index));
  }, []);

  if (!item) {
    return (
      <View style={theme.styles.center}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Screen style={[theme.styles.screen]}>
      <ImageBackground
        source={{ uri: item.backgroundImage }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={theme.styles.center}>
          <View style={theme.styles.detailsInfoContainer}>
            <Text style={theme.styles.detailsTitle}>{item.title}</Text>
          </View>
          <TouchableOpacity
            style={theme.styles.button}
            onPress={() => pop()}
            focusOptions={{
              forbiddenFocusDirections: ['up'],
              animatorOptions: focusAnimation,
            }}
          >
            <Text style={[theme.styles.buttonText, { color: '#FFFFFF' }]}>Go back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={theme.styles.button}
            onPress={() => replace(ROUTES.HOME)}
            focusOptions={{
              forbiddenFocusDirections: ['down'],
              animatorOptions: focusAnimation,
            }}
          >
            <Text style={[theme.styles.buttonText, { color: '#FFFFFF' }]}>Go to home</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </Screen>
  );
};

export default ScreenDetails;
```

## Modal screen

Modal screen is the one which is rendered on the top of everything. Create a new file called `src/screens/modal.tsx` and copy this code there:

```javascript
import React, { useContext } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from '@flexn/sdk';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../config';
import { usePop } from '../hooks';
import Screen from './screen';

const ScreenModal = ({ navigation }: { navigation?: any }) => {
  const pop = usePop({ navigation });
  const { theme } = useContext(ThemeContext);

  return (
    <Screen style={theme.styles.screenModal} screenOrder={1}>
      <View style={theme.styles.modalHeader}>
        <TouchableOpacity onPress={() => pop()} style={theme.styles.icon}>
          <Icon name="close" size={theme.static.iconSize} color={theme.static.colorBrand} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={[theme.styles.container, { flex: 1 }]}>
        <Text style={theme.styles.textH2}>This is my Modal!</Text>
      </ScrollView>
    </Screen>
  );
};

export default ScreenModal;
```

## Screen Cast

Cast screen is super simplistic page which is purpose is only represent a simple text on your casting device. Create a new file called `src/screens/cast.tsx` and copy following code there:

```javascript
import React from 'react';
import { Text } from '@flexn/sdk';
import { themeStyles } from '../config';
import Screen from './screen';

const ScreenCast = () => (
  <Screen style={themeStyles.screen}>
    <Text style={themeStyles.textH2}>This is cast Page!</Text>
  </Screen>
);

export default ScreenCast;
```
