import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React from 'react';
import HomepageFeatures from '../components/Features';
import LogoLines from '../components/LogoLines';
import Platforms from '../components/Platforms';
import Separator from '../components/Separator';
import StartLearning from '../components/StartLearning';
import Subtitle from '../components/Subtitle';
import Title from '../components/Title';
import TVSupport from '../components/TVSupport';

function HomepageHeader() {
    const { siteConfig } = useDocusaurusContext();
    return (
        <>
            <div className="text-container">
                <LogoLines />
                <div className="header-text-container">
                    <Title className="big-text">
                        Write <span style={{ color: '#0A74E6' }}>once</span> <br></br>
                        Deploy <span style={{ color: '#0A74E6' }}>anywhere</span>
                    </Title>
                    <Subtitle className="header-subtitle">
                        Deliver amazing user experiences on all platforms with single SDK.
                    </Subtitle>
                    <Link to="/docs/introduction">
                        <div style={{ display: 'flex', alignItems: 'center', marginTop: 48, fontFamily: 'Inter' }}>
                            <p className="tutorial-url" style={{ color: '#0A74E6' }}>
                                See tutorial
                            </p>
                            <img
                                style={{
                                    filter: 'invert(34%) sepia(76%) saturate(1772%) hue-rotate(196deg) brightness(89%) contrast(104%)',
                                }}
                                className="link-icon"
                                src="/img/linkicon.svg"
                            />
                        </div>
                    </Link>
                </div>
            </div>
            <Separator />
            <style>{`
            .tutorial-url {
              font-size: 16px; 
              margin-right: 10px;
            }
            .header-text-container {
              position: absolute;
              left: 50%;
              top: 225px;
            }
            .header-subtitle {
              font-size: 20px !important; 
              line-height: 24px !important;
              max-width: 469px;
              margin-top: 24px !important;
            }
            .big-text {
              font-style: normal;
              font-weight: 800 !important;
              font-size: 72px !important;
            }
            @media (max-width: 1150px) {
              .big-text {
                font-size: 56px !important;
              }
            }
            @media (max-width: 880px) {
              .big-text {
                font-size: 46px !important;
              }
            }
            @media (max-width: 576px) {
              .header-subtitle {
                font-size: 16px !important;
                line-height: 19px !important;
                margin-top: 16px
              }
              .big-text {
                font-size: 30.359px !important;
                line-height: 37px !important;
              }
            }
            .text-container {
              width: 100%;
              padding: 286px 0 226px;
              display: flex;
              align-items: flex-end;
              justify-content: center;
              flex-direction: column;
            }

            .title-h3 {
                font-size: 16px;
                font-weight: 400;
                color: #565656;
              }
            @media (max-width: 768px) {
              .header-text-container {
                position: relative;
                left: 0;
                top: 0;
              }
              .text-container {
                align-items: flex-start;
                margin-top: 50px;
                width: 100%;
                padding: 102px 0 88px;
              }
              .title-h3 {
                font-size: 14px;
              }
              .tutorial-url {
                font-size: 12px; 
                margin-right: 6px;
              }
            }
          `}</style>
        </>
    );
}

export default function Home(): JSX.Element {
    const { siteConfig } = useDocusaurusContext();
    return (
        <Layout title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
            <div className="container">
                <HomepageHeader />

                <main>
                    <HomepageFeatures />
                    <Platforms />
                    <TVSupport />
                    {/* <FlexnUsers />
                    <Showcases /> */}
                    <StartLearning />
                </main>
            </div>
            <style>{`
            main {
              max-width: 1000px;
              margin: 0 auto;
            }
            `}</style>
        </Layout>
    );
}
