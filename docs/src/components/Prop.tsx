import React from 'react';

export default function Badge({ value, subProperty = false }: { value?: string; subProperty?: boolean }) {
    return (
        <div style={{ display: 'block', marginBottom: 5 }}>
            <code
                style={{
                    fontSize: subProperty ? '1.2rem' : '1.4rem',
                    marginRight: 10,
                    display: 'inline-block',
                    verticalAlign: 'bottom',
                    paddingLeft: 5,
                    paddingRight: 5,
                }}
            >
                <h2 style={{ fontSize: subProperty ? '1.1rem' : '1.6rem' }}>{value}</h2>
            </code>
        </div>
    );
}
