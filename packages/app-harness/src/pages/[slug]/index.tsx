import React from 'react';
import { useRouter } from 'next/router';
import { View } from 'react-native';
import ScreenHome from '../../screens/Home';
import ScreenModal from '../../components/screenModal';
import CastTestScreens from '../../screens/TestCases/Cast';
import FocusTestScreens from '../../screens/TestCases/Focus';
import NavigationTestScreens from '../../screens/TestCases/Navigation';
import PerformanceTestScreens, { PerformanceTestNestedScreens } from '../../screens/TestCases/Performance';
import PlayerTestScreens from '../../screens/TestCases/Player';
import { ROUTES } from '../../config';

type NavigationScreenKey = '/' | 'modal' | 'my-page';

const pages = {
    [ROUTES.HOME]: ScreenHome,
    [ROUTES.MODAL]: ScreenModal,
    ...Object.entries({
        ...FocusTestScreens,
        ...PerformanceTestScreens,
        ...PerformanceTestNestedScreens,
        ...CastTestScreens,
        ...PlayerTestScreens,
        ...NavigationTestScreens,
    }).reduce(
        (obj, [screenName, screen]) => ({
            ...obj,
            [screenName]: screen,
        }),
        {}
    ),
};

const App = () => {
    const router = useRouter();

    const Page = pages[router.query?.slug as NavigationScreenKey];

    if (!Page) {
        return <View />;
    }

    return <Page key={router.asPath} router={router} />;
};

export default App;
