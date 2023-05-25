import React from 'react';
import Image from './Image';
import Section from './Section';

export default function Platforms(): JSX.Element {
    return (
        <Section title="TV Support" subtitle="Designed from ground up with TV support" separator>
            <div className="tv-support">
                <Image src="/img/tv-support.svg" />
            </div>
            <style>{`
                .tv-support {
                    display: flex;
                    flex-direction: column;
                    align-items: center
                }
            `}</style>
        </Section>
    );
}
