import tests from './screens/tests';

// const testsList = [
//     {
//         component: dynamicRows,
//         title: 'Dynamic rows',
//         route: 'DynamicRows',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: hideAllElements,
//         title: 'Hide All Elements',
//         route: 'HideAllElements',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: remoteHandler,
//         title: 'Remote Handler',
//         route: 'RemoteHandler',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: complexTabs,
//         title: 'Complex Tabs',
//         route: 'ComplexTabs',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: scrollToTop,
//         title: 'Scroll To Top',
//         route: 'ScrollToTop',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: viewGroup,
//         title: 'View Group',
//         route: 'ViewGroup',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: list,
//         title: 'List',
//         route: 'List',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: row,
//         title: 'Row',
//         route: 'Row',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: grid,
//         title: 'Grid',
//         route: 'Grid',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: animations,
//         title: 'Animations',
//         route: 'Animations',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: pressableAnimations,
//         title: 'Pressable animations',
//         route: 'PressableAnimations',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: directionalFocus,
//         title: 'Multiple directions focus',
//         route: 'DirectionalFocus',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: dynamicState,
//         title: 'Dynamic State',
//         route: 'DynamicState',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: dynamicState2,
//         title: 'Dynamic State 2',
//         route: 'DynamicState2',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: horizontalScroll,
//         title: 'Horizontal scroll',
//         route: 'HorizontalScroll',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: nestedScroll,
//         title: 'Nested scroll views',
//         route: 'NestedScroll',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: verticalScroll,
//         title: 'Vertical scrolling',
//         route: 'VerticalScroll',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
//     {
//         component: overflow,
//         title: 'Overflowing elements',
//         route: 'Overflow',
//         platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
//     },
// ];

export type Test = {
    component: () => Element;
    title: string;
    route: string;
    id: string;
    description: string;
    platform: string[];
};

const exportTests = () => {
    const testsList: Test[] = [];

    Object.keys(tests).forEach((testKey: string) => {
        //@ts-ignore TODO: fix it
        const test = tests[testKey];

        if (test.title) {
            testsList.push({
                component: test,
                title: test.title,
                route: test.route,
                platform: test.platform,
                id: test.id,
                description: test.description,
            });
        } else {
            console.warn('Test was rejected due to incorrect configuration');
        }
    });

    return testsList;
};

export default exportTests;
