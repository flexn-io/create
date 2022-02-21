import clsx from 'clsx';
import React from 'react';

export default function Button({ value, onClick = undefined, className }) {
    return (
        <>
            <input type="button" className={clsx('btn', className)} value={value} onClick={onClick} />
            <style>{`
                .btn {
                    background-color: #0a74e6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 8px;
                    border: none;
                    color: white;
                    font-family: Inter;
                    font-style: normal;
                    font-weight: normal;
                    font-size: 16px;
                    line-height: 19px;
                    padding: 13px 48px;
                }
                .btn:hover {
                    color: #0a74e6;
                    cursor: pointer;
                    background-color: #fff;
                    border: 1px solid #0a74e6;
                    -webkit-transition: background-color 100ms linear;
                    -ms-transition: background-color 100ms linear;
                    transition: background-color 100ms linear;
                }
                @media (max-width: 768px) {
                    .btn {
                        width: 100%;
                        font-size: 14px;
                        line-height: 17px;
                    }
                }
            `}</style>
        </>
    );
}
