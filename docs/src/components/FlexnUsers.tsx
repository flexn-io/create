import React from 'react';
import Image from './Image';
import Section from './Section';

export default function FlexnUsers(): JSX.Element {
    return (
        <Section
            title="Who’s using Flexn Create?"
            subtitle="There are many variations of passages of Lorem Ipsum available, but the majority
        have suffered alteration in some form."
            separator
        >
            <div className="flexn-users">
                <Image src="/img/flexn-users-logos.svg" />
            </div>
            <style>{`
                .flexn-users {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
            `}</style>
        </Section>
    );
}
