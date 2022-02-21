import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React from 'react';
import Title from '../components/Title';

const LegalPage = () => {
    const { siteConfig } = useDocusaurusContext();

    return (
        <Layout title={`Hello from ${siteConfig.title}`} description="Description will go into a meta tag in <head />">
            <div className="container-full">
                <div className="container">
                    <div className="content">
                        <div className="body">
                            <Title>Terms of use</Title>
                        </div>
                    </div>
                </div>
                <style>{`
        .content {
          padding-top: 100px;
        }
        .content a {
          font-size: 1rem;
        }
        :global(.content-title) {
          font-size: 32px !important;
          margin-top: 20px;
          margin-bottom: 5px;
        }
      `}</style>
            </div>
        </Layout>
    );
};

export default LegalPage;
