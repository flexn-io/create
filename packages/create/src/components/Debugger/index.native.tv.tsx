import React, { useEffect, useState } from 'react';
import { Text, Dimensions, View as RNView } from 'react-native';
import CoreManager from '../../focusManager/service/core';
import { INTERSECTION_MARGIN_HORIZONTAL, INTERSECTION_MARGIN_VERTICAL } from '../../focusManager/nextFocusFinder';
import AbstractFocusModel from '../../focusManager/model/FocusModel';
import View from '../../focusManager/model/view';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function FocusDebugger() {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        let interval: any = null;
        interval = setInterval(() => {
            setSeconds((s) => s + 1);
        }, 500);
        return () => clearInterval(interval);
    });

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

    if (CoreManager.isDebuggerEnabled) {
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
                                width: ctx.getLayout().width,
                                height: ctx.getLayout().height,
                                borderColor,
                                borderWidth: (ctx as View).getIsFocused() ? 5 : 1,
                                position: 'absolute',
                                top: isNaN(ctx.getLayout().absolute.yMin) ? 0 : ctx.getLayout().absolute.yMin,
                                left: isNaN(ctx.getLayout().absolute.xMin) ? 0 : ctx.getLayout().absolute.xMin,
                            }}
                        >
                            <Text style={{ color: borderColor }}>{ctx.getId().substr(ctx.getId().length - 5)}</Text>
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
                        const a1 = (ctx.getLayout().absolute.xCenter - ctx.getLayout().width * 0.5) - INTERSECTION_MARGIN_VERTICAL;
                        const a2 = (ctx.getLayout().absolute.xCenter + ctx.getLayout().width * 0.5) + INTERSECTION_MARGIN_VERTICAL;
                        const a3 = (ctx.getLayout().absolute.yCenter - ctx.getLayout().height * 0.5) - INTERSECTION_MARGIN_HORIZONTAL;
                        const a4 = (ctx.getLayout().absolute.yCenter + ctx.getLayout().height * 0.5) + INTERSECTION_MARGIN_HORIZONTAL;

                        contexts.push(
                            <RNView
                                style={{
                                    width: '100%',
                                    height: 1,
                                    backgroundColor: 'yellow',
                                    top: a3,
                                    position: 'absolute',
                                }}
                            />,
                            <RNView
                                style={{
                                    width: '100%',
                                    height: 1,
                                    backgroundColor: 'yellow',
                                    top: a4,
                                    position: 'absolute',
                                }}
                            />,
                            <RNView
                                style={{
                                    width: 1,
                                    height: '100%',
                                    backgroundColor: 'green',
                                    left: a1,
                                    position: 'absolute',
                                }}
                            />,
                            <RNView
                                style={{
                                    width: 1,
                                    height: '100%',
                                    backgroundColor: 'green',
                                    left: a2,
                                    position: 'absolute',
                                }}
                            />
                        )
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
                        height: 1,
                        backgroundColor: 'red',
                        top: isNaN(CoreManager._currentFocus?.getLayout()?.absolute?.yCenter)
                            ? 0
                            : CoreManager._currentFocus?.getLayout().absolute.yCenter,
                        position: 'absolute',
                    }}
                />
                <RNView
                    style={{
                        height: '100%',
                        width: 1,
                        backgroundColor: 'red',
                        left: isNaN(CoreManager._currentFocus?.getLayout()?.absolute?.xCenter)
                            ? 0
                            : CoreManager._currentFocus?.getLayout().absolute.xCenter,
                        position: 'absolute',
                    }}
                />
                <Text>{seconds}</Text>
            </RNView>
        );
    }
    return null;
}
