import clsx from 'clsx';
import React from 'react';

export default function Subtitle({
    children,
    className,
    style,
}: {
    children: React.ReactNode;
    className?: string;
    style?: any;
}) {
    return (
        <>
            <h2 style={style} className={clsx('title-h3', className)}>
                {children}
            </h2>
            <style>{`
        .title-h3 {
          font-family: Inter;
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          line-height: 19px;
          font-weight: normal;
          font-style: normal;
          color: #565656;
          margin-top: 16px
        }
        @media (max-width: 768px) {
          .title-h3 {
            font-size: 14px;
            line-height: 17px;
            margin-top: 8px
          }
        }
      `}</style>
        </>
    );
}
