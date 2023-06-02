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

const testsList = [
    {
        component: viewGroup,
        title: 'View Group',
        route: 'ViewGroup',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
    {
        component: list,
        title: 'List',
        route: 'List',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
    {
        component: row,
        title: 'Row',
        route: 'Row',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
    {
        component: grid,
        title: 'Grid',
        route: 'Grid',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
    {
        component: animations,
        title: 'Animations',
        route: 'Animations',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
    {
        component: pressableAnimations,
        title: 'Pressable animations',
        route: 'PressableAnimations',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
    {
        component: directionalFocus,
        title: 'Multiple directions focus',
        route: 'DirectionalFocus',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
    {
        component: dynamicState,
        title: 'Dynamic State',
        route: 'DynamicState',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
    {
        component: dynamicState2,
        title: 'Dynamic State 2',
        route: 'DynamicState2',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
    {
        component: horizontalScroll,
        title: 'Horizontal scroll',
        route: 'HorizontalScroll',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
    {
        component: nestedScroll,
        title: 'Nested scroll views',
        route: 'NestedScroll',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
    {
        component: verticalScroll,
        title: 'Vertical scrolling',
        route: 'VerticalScroll',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
    {
        component: overflow,
        title: 'Overflowing elements',
        route: 'Overflow',
        platform: ['androidtv', 'firetv', 'tvos'],
    },
];

export default testsList;
