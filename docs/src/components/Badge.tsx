import React from 'react';

export default function Badge({
    value,
    platform,
    required,
}: {
    value?: string;
    platform?: boolean;
    required?: boolean;
}) {
    const renderBadge = ({ value, color }: { value: string; color?: string }) => (
        <span
            style={{
                borderColor: color ?? '#007bff',
                borderWidth: 1,
                borderStyle: 'solid',
                borderRadius: '3px',
                color: color ?? '#007bff',
                paddingLeft: '0.2rem',
                paddingRight: '0.2rem',
                fontWeight: 700,
                fontSize: 12,
                marginRight: 5,
                marginBottom: 10,
                display: 'inline-block',
            }}
        >
            {value}
        </span>
    );

    if (required) {
        return renderBadge({ value: 'Required', color: '#fa5035' });
    }

    if (platform) {
        return value.split(',').map((val) => renderBadge({ value: val }));
    }

    return null;
}
