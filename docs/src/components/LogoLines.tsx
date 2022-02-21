import React from 'react';

export default function LogoLines() {
    return (
        <>
            <div className="line topLine"></div>
            <div className="line midLine"></div>
            <div className="line botLine"></div>
            <style>{`
                .line {
                    position: absolute;
                    height: 48px;
                    background: #0a74e6;
                    border-radius: 151px;
                }
                .topLine {
                    width: 662px;
                    left: -78px;
                    top: 156px;
                }
                .midLine {
                    width: 377px;
                    left: -111px;
                    top: 252px;
                }
                .botLine {
                    width: 24px;
                    right: 0;
                    top: 563px;
                    border-radius: 151px 0 0 151px;
                }
                @media (max-width: 768px) {
                    .line {
                        position: absolute;
                        height: 24px;
                        background: #0a74e6;
                        border-radius: 61.3034px;
                    }
                    .topLine {
                        width: 268.76px;
                        left: -41.6px;
                        top: 91px;
                    }
                    .midLine {
                        width: 153.06px;
                        left: -55px;
                        top: 139.71px;
                    }
                    .botLine {
                        width: 12px;
                        right: 0;
                        top: 340px;
                        border-radius: 61.3034px 0 0 61.3034px;
                    }
                }
            `}</style>
        </>
    );
}
