import React from 'react';
import { useRouter } from 'next/router';
import { View } from 'react-native';
import ScreenHome from '../../screens/screenHome';
import ScreenCarousels from '../../screens/screenCarousels';
import ScreenDetails from '../../screens/screenDetails';
import ScreenModal from '../../screens/screenModal';
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
        return <View />;
    }

    return <Page key={router.asPath} router={router} route={router.query?.slug} />;
};

export default App;
