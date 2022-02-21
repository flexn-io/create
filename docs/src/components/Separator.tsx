import React from 'react';

export default function Separator() {
    return (
        <>
            <div className="separator" />
            <style>{`
                .separator {
                    margin-top: 144px;
                    margin-bottom: 48px;
                    bottom: 0;
                    width: 100%;
                    height: 2px;
                    background: linear-gradient(
                        90deg,
                        rgba(255, 255, 255, 0) 0%,
                        #000000 50%,
                        rgba(255, 255, 255, 0) 100%
                    );
                }
                @media (max-width: 768px) {
                    .separator {
                        margin-top: 64px;
                        margin-bottom: 24px;
                    }
                }
            `}</style>
        </>
    );
}
