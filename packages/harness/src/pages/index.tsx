import React from 'react';
import { useRouter } from 'next/router';
import ScreenHome from '../screens/Home';

const HomePage = () => <ScreenHome router={useRouter()} />;
export default HomePage;
