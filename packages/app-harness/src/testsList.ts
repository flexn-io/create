import viewGroup from './screens/tests/viewGroup';
import animations from './screens/tests/animations';
import directionalFocus from './screens/tests/directionalFocus';
import dynamicState from './screens/tests/dynamicState';
import dynamicState2 from './screens/tests/dynamicState2';
import horizontalScroll from './screens/tests/horizontalScroll';
import list from './screens/tests/list';
import row from './screens/tests/row';
import nestedScroll from './screens/tests/nestedScroll';
import overflow from './screens/tests/overflow';
import pressableAnimations from './screens/tests/pressableAnimations';
import verticalScroll from './screens/tests/verticalScroll';
import grid from './screens/tests/grid';
import scrollToTop from './screens/tests/scrollToTop';
import complexTabs from './screens/tests/complexTabs';
import hideAllElements from './screens/tests/hideAllElements';
import dynamicRows from './screens/tests/dynamicRows';
import remoteHandler from './screens/tests/remoteHandler';

const testsList = [
    {
        component: dynamicRows,
        title: 'Dynamic rows',
        route: 'DynamicRows',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: hideAllElements,
        title: 'Hide All Elements',
        route: 'HideAllElements',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: remoteHandler,
        title: 'Remote Handler',
        route: 'RemoteHandler',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: complexTabs,
        title: 'Complex Tabs',
        route: 'ComplexTabs',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: scrollToTop,
        title: 'Scroll To Top',
        route: 'ScrollToTop',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: viewGroup,
        title: 'View Group',
        route: 'ViewGroup',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: list,
        title: 'List',
        route: 'List',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: row,
        title: 'Row',
        route: 'Row',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: grid,
        title: 'Grid',
        route: 'Grid',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: animations,
        title: 'Animations',
        route: 'Animations',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: pressableAnimations,
        title: 'Pressable animations',
        route: 'PressableAnimations',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: directionalFocus,
        title: 'Multiple directions focus',
        route: 'DirectionalFocus',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: dynamicState,
        title: 'Dynamic State',
        route: 'DynamicState',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: dynamicState2,
        title: 'Dynamic State 2',
        route: 'DynamicState2',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: horizontalScroll,
        title: 'Horizontal scroll',
        route: 'HorizontalScroll',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: nestedScroll,
        title: 'Nested scroll views',
        route: 'NestedScroll',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: verticalScroll,
        title: 'Vertical scrolling',
        route: 'VerticalScroll',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
    {
        component: overflow,
        title: 'Overflowing elements',
        route: 'Overflow',
        platform: ['androidtv', 'firetv', 'tvos', 'tizen', 'webos'],
    },
];

export default testsList;
