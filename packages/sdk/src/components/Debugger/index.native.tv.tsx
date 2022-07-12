import React, { useEffect, useState } from 'react';
import { Text, Dimensions, View as RNView } from 'react-native';
import CoreManager from '../../focusManager/model/core';
import AbstractFocusModel from '../../focusManager/model/AbstractFocusModel';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function FocusDebugger() {
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        let interval: any = null;
        if (CoreManager.hasPendingUpdateGuideLines) {
            CoreManager.executeUpdateGuideLines();
        }
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
                                borderWidth: ctx.getIsFocused() ? 5 : 1,
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
                        top: isNaN(CoreManager.guideLineY) ? 0 : CoreManager.guideLineY,
                        position: 'absolute',
                    }}
                />
                <RNView
                    style={{
                        height: '100%',
                        width: 1,
                        backgroundColor: 'red',
                        left: isNaN(CoreManager.guideLineX) ? 0 : CoreManager.guideLineX,
                        position: 'absolute',
                    }}
                />
                <Text>{seconds}</Text>
            </RNView>
        );
    }
    return null;
}
