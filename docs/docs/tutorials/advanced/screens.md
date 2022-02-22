---
sidebar_position: 4
---

# Screens

Let's start filling content of our application. Flexn Template contains several platform agnostics screens which means the same file is rendered on all the platforms. 

## Abstracted screen
First let's create an abstracted screen wrapper which will hold logic repeated over each screen. In screens folder create file called `screens.tsx` 

```javascript
import { Screen as FMScreen, ScreenProps, ScreenStates } from '@flexn/sdk';
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '../hooks';

const Screen = ({ children, stealFocus, focusOptions, style, ...rest }: ScreenProps) => {
  const [screenState, setScreenState] = useState<ScreenStates>('foreground');

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

We are using [Screen](../components/screen) component to wrap every template screen and by utilizing `useFocusEffect` hook setting state of the screen whatever screen is in background or foreground. It's worth to mention that [Screen](../components/screen)functionality is applied only for TV platforms for the rest behind the scenes it's only simple React Native View.

## Home screen

It's a good practice to start from Home screen. Create a new file in `screens/screenHome.tsx`. And copy over the code above:

```javascript
```

## Carousels screen 

One of the most dynamic screens in whole template. Let's add several rows with some nice images inside. First let's create a file `utils/index.ts` and write a function which generates a random data for us:

```javascript
import { isFactorMobile } from 'renative';

const kittyNames = [
    'Abby',
    'Angel',
    'Annie',
    'Baby',
    'Bailey',
    'Bandit'
];

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

    const temp: { backgroundImage: string; title: string; index: number }[] = [];
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

Next create a file `screens/screenCarousels.tsx`. There define screen layout define sizes of ours rows based on the platform and start filling array with data:

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
import Router from 'next/router';
import { testProps } from '../utils';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions } from 'react-native';
import { isFactorMobile, isPlatformWeb, useNavigate } from 'renative';
import { Ratio, ThemeContext, ROUTES } from '../config';
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

const RecyclerExample = () => {
    //implementation in next example
    return null;
};

const ScreenCarousels = (props) => {
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
    recyclers.map((recyclerInfo, i) => <RecyclerExample key={i} rowNumber={i} {...props} {...recyclerInfo} />);

  return (
    <Screen style={theme.styles.screen}>
      <ScrollView>{renderRecyclers()}</ScrollView>
    </Screen>
  );
};

export default ScreenCarousels;
```

And finally we are adding component which is actual our recyclable list rendered:

```javascript
const RecyclerExample = ({ items, rowNumber, dimensions: { layout, item }, parentContext, ...rest }: any) => {
  const navigate = useNavigate(rest);
  const { theme } = useContext(ThemeContext);

  const [dataProvider] = useState(
    new RecyclableListDataProvider((r1: number, r2: number) => r1 !== r2).cloneWithRows(items)
  );

  const layoutProvider = useRef(
    new RecyclableListLayoutProvider(
      () => '_',
      (_: string | number, dim: { width: number; height: number }) => {
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
                if (isPlatformWeb) {
                  Router.push({
                    pathname: ROUTES.DETAILS,
                    query: { row: rowNumber, index: data.index },
                  });
                } else {
                  navigate(ROUTES.DETAILS, '/[slug]', { row: rowNumber, index: data.index });
                }
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

Next is Details screen. That's the target page when we click on any of carousel items. Let's add it at `screens/screenDetails.tsx`. And copy code below:

```javascript
```

## Modal screen

Modal screen is the one which is rendered on the top of everything. Create a new file called `screens/screenModal.tsx`. And copy this code there:

```javascript
```

## Screen Cast

Cast screen is super simplistic page which is purpose is only represent a simple text on your casting device. Create a new file called `screens/screenCase.tsx` and copy this code there

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

