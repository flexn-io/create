import clsx from 'clsx';
import React from 'react';
import Subtitle from './Subtitle';
import { Text } from './Typography';

const Module = ({ title, subtitle, websiteUrl, containerClassName = '' }) => {
    return (
        <>
            <div className={clsx('text-block', containerClassName)}>
                <Text className="title">{title}</Text>
                <Subtitle style={{ textAlign: 'center', marginTop: 0 }}>{subtitle}</Subtitle>
                <div className="link-container">
                    <a target="_blank" href={websiteUrl} rel="noopener noreferrer">
                        <div className="link-style-1">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <p className="url">More info</p>
                                <img className="link-icon" src="/img/more-info.svg" />
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            <style>{`
            [class="text-block"] {
              margin-bottom: 0px !important;
            }
        .firstModule {
          margin-right: 32px !important;
        }
        @media (max-width: 768px) {

          .firstModule {
            margin-bottom: 24px !important;
            margin-right: 0 !important;
          }
        }
        .link-container > a {
          color: inherit;
        }
        .link-container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          min-width: 100%;
          margin-top: auto;
        }

        .link-icon {
          height: 14px;
          width: 14px;
        }

        .github-icon {
          height: 20px;
          width: 20px;
        }

        .social-link {
          margin: 0 2px;
          height: 20px;
          width: 20px;
        }

        .text-block:hover .link-icon {
          filter: invert(38%) sepia(19%) saturate(0%) hue-rotate(237deg)
            brightness(84%) contrast(97%);
        }

        .text-block:hover {
          box-shadow: 0px 20px 50px rgba(0, 0, 0, 0.1);
          border: 1px solid transparent;
        }

        .image {
          height: 100px;
        }

        .title {
          font-family: Inter;
          font-style: normal;
          font-weight: bold !important;
          font-size: 24px !important;
          line-height: 33px !important;
          margin: 0 0 16px !important;
        }

        .url {
          margin: 0;
          margin-right: 10px;
          font-family: Inter;
          font-style: normal;
          font-weight: normal;
          font-size: 14px;
          line-height: 19px;
        }

        .p-1 {
          margin-top: 20px;
          font-family: "Inter";
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          line-height: 26px;
          color: #565656;
        }

        .text-block {
          cursor: pointer;
          margin-bottom: 32px;
          border: 1px solid #e4e4e4;
          display: flex;
          padding: 32px 24px 24px;
          align-items: center;
          flex-direction: column;
          max-width: 484px;
          min-height: 236px;
          width: 100%;
        }

        .align-containers {
          display: flex;
          flex-direction: column;
          margin-left: 42px;
        }

        @media (max-width: 768px) {
          .link-icon {
            height: 10px;
            width: 10px;
          }
          .link-container {
            display: flex;
            margin-top: 10%;
          }
          .image {
            height: 72px;
          }
          .text-block {
            width: 100%;
            padding: 24px 14px 14px;
            min-height: initial;
          }
          .title {
            font-family: Inter;
            font-style: normal;
            font-weight: bold !important;
            font-size: 20px !important;
            line-height: 27px !important;
          }
          .url {
            margin-right: 6px;
            font-size: 12px;
            line-height: 16px;
          }
        }
      `}</style>
        </>
    );
};

export default Module;
