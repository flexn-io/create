import Link from '@docusaurus/Link';
import { useThemeConfig } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import ThemedImage, { Props as ThemedImageProps } from '@theme/ThemedImage';
import React from 'react';
import Facebook from '../../../static/img/facebook.svg';
import Github from '../../../static/img/github.svg';
import Instagram from '../../../static/img/instagram.svg';
import Linkedin from '../../../static/img/linkedin.svg';
import Twitter from '../../../static/img/twitter.svg';
import Youtube from '../../../static/img/youtube.svg';
import styles from './styles.module.css';
function FooterLogo({ sources, alt, width, height }: Pick<ThemedImageProps, 'sources' | 'alt' | 'width' | 'height'>) {
    return <ThemedImage className="footer__logo" alt={alt} sources={sources} width={width} height={height} />;
}

const socialLinks = [
    { url: 'https://github.com/flexn-io', icon: () => <Github /> },
    { url: 'https://twitter.com/flexn_io', icon: () => <Twitter /> },
    { url: 'https://www.linkedin.com/company/flexn', icon: () => <Linkedin /> },
    {
        url: 'https://www.youtube.com/channel/UCv2GG80orsKHKJVxlBY78tw',
        icon: () => <Youtube />,
    },
    { url: 'https://www.facebook.com/flexn.co', icon: () => <Facebook /> },
    { url: 'https://www.instagram.com/flexn_io/', icon: () => <Instagram /> },
];

const SocialLinks = () => (
    <>
        <div className="social-links">
            {socialLinks.map((link) => (
                <Link key={link.url} href={link.url}>
                    <a className="social-link" target="_blank">
                        {link.icon()}
                    </a>
                </Link>
            ))}
        </div>
        <style>{`
            .social-links {
                display: flex;
                align-items: end;
            }
            .social-link {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 16px;
            }
            .social-link:hover :global(svg path) {
                fill: #0a74e6;
            }
            @media (max-width: 768px) {
                .footer {
                    padding: 20px 20px;
                    flex-direction: column;
                }
                .social-links {
                    justify-self: center;
                    margin-top: 30px;
                }
            }
        `}</style>
    </>
);

function Footer() {
    const { footer } = useThemeConfig();

    const { copyright, logo = {} } = footer || {};
    const sources = {
        light: useBaseUrl(logo.src),
        dark: useBaseUrl(logo.srcDark || logo.src),
    };

    if (!footer) {
        return null;
    }

    const links = [
        { url: '/privacy', title: 'Privacy' },
        { url: '/cookies', title: 'Cookies' },
        // { url: '/trademarks', title: 'Trademarks' },
        // { url: '/terms', title: 'Terms of use' },
    ];

    return (
        <div className="footer">
            {logo && (logo.src || logo.srcDark) && (
                <div className="margin-bottom--sm">
                    {logo.href ? (
                        <Link href={logo.href} className={styles.footerLogoLink}>
                            <FooterLogo alt={logo.alt} sources={sources} width={logo.width} height={logo.height} />
                        </Link>
                    ) : (
                        <FooterLogo alt={logo.alt} sources={sources} />
                    )}
                </div>
            )}
            <div className="info-container">
                {copyright ? (
                    <div
                        className="footer__copyright"
                        // Developer provided the HTML, so assume it's safe.
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={{
                            __html: copyright,
                        }}
                    />
                ) : null}
                <SocialLinks />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 36 }}>
                {links.map((link) => (
                    <Link
                        key={link.title}
                        href={link.url}
                        style={{
                            display: 'flex',
                            marginRight: 36,
                        }}
                    >
                        <p>{link.title}</p>
                    </Link>
                ))}
            </div>
            <style>{`
                .info-container {
                    display: flex;
                    justify-content: space-between;
                }
                .links {
                    display: flex;
                    align-items: end;
                }
                .footer-link {
                    margin: 0 24px;
                }
                .logo-wrapper {
                    width: 93px;
                }
                :global(.copyright) {
                    margin-top: 24px;
                    font-family: Inter !important;
                    font-style: normal !important;
                    font-weight: normal !important;
                    font-size: 16px !important;
                    line-height: 19px !important;
                }
                .logo-container {
                    display: flex;
                    flex-direction: column;
                    align-items: start;
                }
                .footer {
                    max-width: 1000px;
                    margin: 0 auto;
                    width: 100%;
                    padding: 176px 0px 48px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    background-color: transparent;
                }
                .footer__copyright{
                    margin-top: 24px;
                    font-family: Inter !important;
                    font-style: normal !important;
                    font-weight: normal !important;
                    font-size: 16px !important;
                    line-height: 19px !important;
                }
                @media (max-width: 768px) {
                    .info-container {
                        align-items: center;
                        flex-direction: column-reverse;
                    }
                    .logo-container {
                        align-items: center;
                    }
                    .logo-wrapper {
                        align-self: flex-start;
                    }
                    .footer__copyright {
                        font-size: 14px !important;
                        line-height: 17px !important;
                    }
                    .footer {
                        padding: 96px 20px 32px;
                        flex-direction: column;
                        margin-top: 56px;
                    }
                    .links {
                        justify-self: center;
                    }
                }
            `}</style>
        </div>
    );
}

export default React.memo(Footer);
