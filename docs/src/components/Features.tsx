import React from 'react';
import Module from './Module';
import Section from './Section';

export default function HomepageFeatures(): JSX.Element {
    return (
        <Section
            title="Features"
            subtitle="Flexn Create comes with built-in features making multiplatform development easy"
            separator
        >
            <div>
                <Module
                    title="Bootstrap templates"
                    subtitle="Ready to go template allows you to go from 0 to 100 
                almost instantly."
                    websiteUrl="https://create.flexn.org/docs/tutorials/advanced/bootstrap"
                    containerClassName="firstModule"
                />
                <Module
                    title="Powered by ReNative"
                    subtitle="Flexn Create adds optimised multiplatform UI on top of ReNative ecosystem allowing you take advantage of full project control,
                scalability features and deployment pipelines out of the box"
                    websiteUrl="https://renative.org/"
                />
            </div>
            <div>
                <Module
                    title="Javascript & Typescript"
                    subtitle="You can use Flexn Create in both Javascript and Typescript environments"
                    websiteUrl="https://create.flexn.org/docs/introduction"
                    containerClassName="firstModule"
                />

                <Module
                    title="Community Plugins"
                    subtitle="Flexn Create is just the entry point into the vast pool of 3rd party opensource plugins"
                    websiteUrl="https://create.flexn.org/docs/tutorials/basics/quickstart"
                />
            </div>
        </Section>
    );
}
