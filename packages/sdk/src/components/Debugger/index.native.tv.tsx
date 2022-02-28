import React, { useEffect, useState } from 'react';
import { Text, Dimensions, View as RNView } from 'react-native';
import { SCREEN_STATES } from '../../focusManager/constants';
import CoreManager from '../../focusManager/core';
import type { Context } from '../../focusManager/types';

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

    const contexts: any = [];
    const contextMap = CoreManager.contextMap; // eslint-disable-line prefer-destructuring
    Object.values(contextMap).forEach((ctx: Context) => {
        const parentInForeground = ctx.screen?.state === SCREEN_STATES.FOREGROUND;
        if (ctx.layout && parentInForeground) {
            const borderColor = colors[ctx.type] || 'white';
            contexts.push(
                <RNView
                    key={`${ctx.id}${ctx.nodeId}`}
                    style={{
                        width: ctx.layout.width,
                        height: ctx.layout.height,
                        borderColor,
                        borderWidth: ctx.isFocused ? 5 : 1,
                        position: 'absolute',
                        top: ctx.layout.absolute.yMin,
                        left: ctx.layout.absolute.xMin,
                    }}
                >
                    <Text style={{ color: borderColor }}>{ctx.id.substr(ctx.id.length - 5)}</Text>
                </RNView>,
                <RNView
                    key={ctx.id}
                    style={{
                        width: 6,
                        height: 6,
                        borderRadius: 5,
                        backgroundColor: borderColor,
                        position: 'absolute',
                        left: ctx.layout.absolute.xCenter - 3,
                        top: ctx.layout.absolute.yCenter - 3,
                    }}
                />
            );
        }
    });

    if (CoreManager.isDebuggerEnabled) {
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
                        top: CoreManager.guideLineY,
                        position: 'absolute',
                    }}
                />
                <RNView
                    style={{
                        height: '100%',
                        width: 1,
                        backgroundColor: 'red',
                        left: CoreManager.guideLineX,
                        position: 'absolute',
                    }}
                />
                <Text>{seconds}</Text>
            </RNView>
        );
    }
    return null;
}
