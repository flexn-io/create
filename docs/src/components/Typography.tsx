import clsx from 'clsx';
import React from 'react';

type TextProps = {
    children: React.ReactNode;
    className?: string;
    bold?: boolean;
    blue?: boolean;
    lightBold?: boolean;
    white?: boolean;
};

export const LargeText = ({ children, className, bold, blue, lightBold }: TextProps) => {
    return (
        <>
            <span
                className={clsx('text', className, {
                    bold,
                    blue,
                    lightBold,
                })}
            >
                {children}
            </span>
            <style>{`
                .text {
                    font-family: 'Inter';
                    font-weight: 800;
                    font-size: 128px;
                    line-height: 155px;
                }
                @media (max-width: 900px) {
                    .text {
                        font-size: 80px;
                        line-height: 100px;
                    }
                }
                @media (max-width: 580px) {
                    .text {
                        font-size: 70px;
                        line-height: 100px;
                    }
                }
                @media (max-width: 440px) {
                    .text {
                        font-size: 50px;
                        line-height: 70px;
                    }
                }
            `}</style>
        </>
    );
};

export const MediumText = ({ children, className, bold, blue, lightBold, white }: TextProps) => {
    return (
        <>
            <span
                className={clsx('text', className, {
                    bold,
                    blue,
                    lightBold,
                    white,
                })}
            >
                {children}
            </span>
            <style>{`
                .text {
                    font-size: 20px;
                    line-height: 24px;
                }
            `}</style>
        </>
    );
};

export const Text = ({ children, className, bold, blue, lightBold, white }: TextProps) => {
    return (
        <>
            <span
                className={clsx('text', className, {
                    bold,
                    blue,
                    lightBold,
                    white,
                })}
            >
                {children}
            </span>
            <style>{`
                .text {
                    font-size: 15px;
                    line-height: 18px;
                    font-weight: 400;
                }
            `}</style>
        </>
    );
};
