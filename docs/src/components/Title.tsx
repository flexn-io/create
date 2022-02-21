import clsx from 'clsx';
import React from 'react';

type TitleProps = {
    children: React.ReactNode;
    className?: string;
};

export default function Title({ children, className }: TitleProps) {
    return (
        <>
            <h2 className={clsx('title-h2', className)}>{children}</h2>
            <style>{`
                .title-h2 {
                    font-family: 'Inter';
                    font-size: 48px;
                    font-weight: 700;
                }
                .text-1 {
                    font-family: Inter;
                    font-style: normal;
                    font-weight: bold !important;
                    font-size: 24px !important;
                    line-height: 33px !important;
                    margin: 48px 0 16px;
                }
                @media (max-width: 768px) {
                    .title-h2 {
                        font-size: 32px;
                    }
                }
                @media (max-width: 576px) {
                    .title-h2 {
                        font-size: 24px;
                    }
                    .text-1 {
                        font-family: Inter;
                        font-style: normal;
                        font-weight: bold !important;
                        font-size: 20px !important;
                        line-height: 27px !important;
                    }
                }
            `}</style>
        </>
    );
}
