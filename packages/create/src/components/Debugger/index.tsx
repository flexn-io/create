import React, { useEffect, useState } from 'react';
import { Text, Dimensions, View as RNView, Platform } from 'react-native';
import CoreManager from '../../focusManager/service/core';
import { INTERSECTION_MARGIN_HORIZONTAL, INTERSECTION_MARGIN_VERTICAL } from '../../focusManager/nextFocusFinder';
import AbstractFocusModel from '../../focusManager/model/abstractFocusModel';
import View from '../../focusManager/model/view';
import { Ratio } from '../../helpers';
import { useTVRemoteHandler } from '../../remoteHandler';
import Logger from '../../focusManager/service/logger';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function FocusDebugger() {
    if (!CoreManager.isFocusManagerEnabled()) {
        return <RNView />;
    }

    const [_, setSeconds] = useState(0); // eslint-disable-line
    const [enabled, _setEnabled] = useState(false);
    const enabledRef = React.useRef(enabled);
    const interval: any = React.useRef();
    const setEnabled = (value: boolean) => {
        enabledRef.current = value;
        _setEnabled(value);
    };

    const [nextFocus] = useState({
        right: '',
        left: '',
        up: '',
        down: '',
    });

    useEffect(() => {
        if (enabledRef.current) {
            interval.current = setInterval(() => {
                setSeconds((s) => s + 1);
            }, 500);
        }
        return () => {
            if (!enabledRef.current) {
                clearInterval(interval.current);
            }
        };
    }, [enabledRef.current]);

    useTVRemoteHandler(({ eventType, eventKeyAction }) => {
        if (Platform.OS === 'ios' || Platform.OS === 'web') {
            if (eventKeyAction === 'down' && eventType === 'playPause') {
                CoreManager.setDebuggerEnabled(!CoreManager.isDebuggerEnabled());
                Logger.setIsDebuggerEnabled(CoreManager.isDebuggerEnabled()).debug(CoreManager);
                setEnabled(!enabledRef.current);
            }
        } else {
            if (eventKeyAction === 'down' && eventType === 'd') {
                CoreManager.setDebuggerEnabled(!CoreManager.isDebuggerEnabled());
                setEnabled(!enabledRef.current);
            }
        }
    });

    // useEffect(() => {
    //     if (enabledRef.current) {
    //         const nextRight = getNextFocus('right');
    //         const nextLeft = getNextFocus('left');
    //         const nextUp = getNextFocus('up');
    //         const nextDown = getNextFocus('down');

    //         setNextFocus({
    //             right: nextRight?.nodeId?.toString() || '',
    //             left: nextLeft?.nodeId?.toString() || '',
    //             up: nextUp?.nodeId?.toString() || '',
    //             down: nextDown?.nodeId?.toString() || '',
    //         });
    //     }
    // }, [CoreManager._currentFocus?.getId(), enabledRef.current]);

    // const getNextFocus = (direction: string) => {
    //     if (CoreManager._currentFocus) {
    //         if (CoreManager._currentFocus.getFocusTaskExecutor(direction)) {
    //             const focusExecutor = CoreManager._currentFocus.getFocusTaskExecutor(direction);
    //             return focusExecutor?.getNextFocusable(direction);
    //         }

    //         return CoreManager.getNextFocusableContext(direction);
    //     }
    // };

    const grid = [];
    for (let i = 0; i < 10; i++) {
        grid.push(
            <RNView
                key={`focus-debugger-grid-${i}`}
                style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#333333',
                    position: 'absolute',
                    top: i * 100,
                }}
            />
        );
    }

    const colors: any = {
        view: 'white',
        screen: 'yellow',
        recycler: 'green',
        scrollView: 'purple',
    };

    if (enabledRef.current) {
        const contexts: any = [];
        const contextMap = CoreManager.getFocusMap(); // eslint-disable-line prefer-destructuring
        Object.values(contextMap)
            .filter((ctx) => ctx.getType() === 'view')
            .forEach((ctx: AbstractFocusModel) => {
                const parentInForeground = ctx.getScreen()?.isInForeground();
                if (ctx.getLayout() && parentInForeground) {
                    const borderColor = colors[ctx.getType()] || 'white';
                    contexts.push(
                        <RNView
                            key={`${ctx.getId()}${ctx.nodeId}`}
                            style={{
                                width: isNaN(ctx.getLayout().width) ? 0 : ctx.getLayout().width,
                                height: isNaN(ctx.getLayout().height) ? 0 : ctx.getLayout().height,
                                borderColor,
                                borderWidth: (ctx as View).getIsFocused() ? 5 : 1,
                                position: 'absolute',
                                top: isNaN(ctx.getLayout().absolute.yMin) ? 0 : ctx.getLayout().absolute.yMin,
                                left: isNaN(ctx.getLayout().absolute.xMin) ? 0 : ctx.getLayout().absolute.xMin,
                            }}
                        >
                            <RNView style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', width: Ratio(50) }}>
                                <Text
                                    style={{
                                        color: borderColor,
                                        fontWeight: '900',
                                        fontSize: Ratio(16),
                                        textAlign: 'center',
                                    }}
                                >
                                    {typeof ctx.nodeId === 'number' ? ctx.nodeId : ctx.getId()}
                                </Text>
                            </RNView>
                        </RNView>,
                        <RNView
                            key={ctx.getId()}
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: 5,
                                backgroundColor: borderColor,
                                position: 'absolute',
                                top: isNaN(ctx.getLayout().absolute.xCenter - 3)
                                    ? 0
                                    : ctx.getLayout().absolute.xCenter - 3,
                                left: isNaN(ctx.getLayout().absolute.yCenter - 3)
                                    ? 0
                                    : ctx.getLayout().absolute.yCenter - 3,
                            }}
                        />
                    );

                    if (CoreManager.getCurrentFocus()?.getId() === ctx.getId()) {
                        const a1 =
                            ctx.getLayout().absolute.xCenter -
                            ctx.getLayout().width * 0.5 -
                            INTERSECTION_MARGIN_VERTICAL;
                        const a2 =
                            ctx.getLayout().absolute.xCenter +
                            ctx.getLayout().width * 0.5 +
                            INTERSECTION_MARGIN_VERTICAL;
                        const a3 =
                            ctx.getLayout().absolute.yCenter -
                            ctx.getLayout().height * 0.5 -
                            INTERSECTION_MARGIN_HORIZONTAL;
                        const a4 =
                            ctx.getLayout().absolute.yCenter +
                            ctx.getLayout().height * 0.5 +
                            INTERSECTION_MARGIN_HORIZONTAL;

                        contexts.push(
                            <RNView
                                style={{
                                    width: '100%',
                                    height: 2,
                                    backgroundColor: 'yellow',
                                    top: a3,
                                    position: 'absolute',
                                }}
                            />,
                            <RNView
                                style={{
                                    width: '100%',
                                    height: 2,
                                    backgroundColor: 'yellow',
                                    top: a4,
                                    position: 'absolute',
                                }}
                            />,
                            <RNView
                                style={{
                                    width: 2,
                                    height: '100%',
                                    backgroundColor: 'green',
                                    left: a1,
                                    position: 'absolute',
                                }}
                            />,
                            <RNView
                                style={{
                                    width: 2,
                                    height: '100%',
                                    backgroundColor: 'green',
                                    left: a2,
                                    position: 'absolute',
                                }}
                            />
                        );
                    }
                }
            });

        return (
            <RNView
                style={{
                    width: windowWidth,
                    height: windowHeight,
                    backgroundColor: '#00000066',
                    position: 'absolute',
                }}
            >
                {grid}
                {contexts}
                <RNView
                    style={{
                        width: '100%',
                        height: 2,
                        backgroundColor: 'red',
                        top: CoreManager.getCurrentFocus()?.getLayout()?.absolute?.yCenter ?? 0,
                        position: 'absolute',
                    }}
                />
                <RNView
                    style={{
                        height: '100%',
                        width: 2,
                        backgroundColor: 'red',
                        left: CoreManager.getCurrentFocus()?.getLayout()?.absolute?.xCenter ?? 0,
                        position: 'absolute',
                    }}
                />
                <RNView
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 10,
                        width: Ratio(250),
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        style={{ color: 'white', fontSize: Ratio(16) }}
                    >{`Right: ${nextFocus.right} Left: ${nextFocus.left}`}</Text>
                    <Text
                        style={{ color: 'white', fontSize: Ratio(16) }}
                    >{`Up: ${nextFocus.up} Down: ${nextFocus.down}`}</Text>
                </RNView>
            </RNView>
        );
    }
    return null;
}
