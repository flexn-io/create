import viewGroup from './screens/viewGroup';
import animations from './screens/animations';
import directionalFocus from './screens/directionalFocus';
import dynamicState from './screens/dynamicState';
import dynamicState2 from './screens/dynamicState2';
import horizontalScroll from './screens/horizontalScroll';
import list from './screens/list';
import row from './screens/row';
import nestedScroll from './screens/nestedScroll';
import overflow from './screens/overflow';
import pressableAnimations from './screens/pressableAnimations';
import verticalScroll from './screens/verticalScroll';
import grid from './screens/grid';
import scrollToTop from './screens/scrollToTop';
import complexTabs from './screens/complexTabs';
import hideAllElements from './screens/hideAllElements';
import remoteHandler from './screens/remoteHandler';

const testsList = [
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
