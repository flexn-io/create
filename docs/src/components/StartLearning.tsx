import { useHistory } from '@docusaurus/router';
import React from 'react';
import Button from './Button';
import Image from './Image';
import Section from './Section';
export default function StartLearning(): JSX.Element {
    const history = useHistory();

    return (
        <Section
            title="Start learning now"
            subtitle="It has survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged."
        >
            <div className="start-learning">
                <Image src="/img/StartLearning.svg" />
                <Button
                    onClick={() => history.push('/docs/introduction')}
                    className="button"
                    value="Get started"
                ></Button>
            </div>
            <style>{`
                .button {
                    margin-top: 64px;
                }
                .start-learning {
                    display: flex;
                    flex-direction: column;
                    align-items: center
                }
                @media (max-width: 768px) {
                    .button {
                        margin-top: 32px;
                    }
                }
            `}</style>
        </Section>
    );
}
