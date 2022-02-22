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
