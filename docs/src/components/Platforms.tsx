import React from 'react';
import Image from './Image';
import Section from './Section';

export default function Platforms(): JSX.Element {
    return (
        <Section title="Platforms" subtitle="Unprecended platform support" separator>
            <div className="platforms">
                <Image src="/img/devices.svg" />
            </div>
            <style>{`
                .platforms {
                    display: flex;
                    flex-direction: column;
                    align-items: center
                }
            `}</style>
        </Section>
    );
}
