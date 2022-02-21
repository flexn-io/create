import React from 'react';
import Module from './Module';
import Section from './Section';

export default function HomepageFeatures(): JSX.Element {
    return (
        <Section
            title="Features"
            subtitle="Flexn SDK comes with built-in features making multiplatform development easy"
            separator
        >
            <div>
                <Module
                    title="Bootstrap templates"
                    subtitle="Ready to go template allows you to go from 0 to 100 
                almost instantly."
                    websiteUrl="link"
                    containerClassName="firstModule"
                />
                <Module
                    title="Powered by ReNative"
                    subtitle="Flexn SDK adds optimised multiplatform UI on top of ReNative ecosystem allowing you take advantage of full project control,
                scalability features and deployment pipelines out of the box"
                    websiteUrl="link"
                />
            </div>
            <div>
                <Module
                    title="Javascript & Typescript"
                    subtitle="You can use Flexn SDK in both Javascript and Typescript environments"
                    websiteUrl="link"
                    containerClassName="firstModule"
                />

                <Module
                    title="Community Plugins"
                    subtitle="The SDK is just the entry point into the vast pool of 3rd party opensource plugins"
                    websiteUrl="link"
                />
            </div>
        </Section>
    );
}
