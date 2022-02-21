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
                            <Title>Cookie Policy</Title>
                            <p>
                                <b>Version 1.0</b> — May 1 , 2020
                            </p>

                            <p>
                                This cookie policy describes how Flexn B.V. and its related companies (collectively
                                “Flexn”) use cookies and related technologies on www.flexn.io, within our websites, our
                                mobile application, our online product and other websites that Flexn operates and that
                                link to this policy (collectively “Websites”).
                            </p>

                            <Title>What is a cookie?</Title>
                            <p>
                                A “cookie” is a small text file sent to your computer or mobile device used to collect
                                data regarding your use of the Site and Services. Cookies do many different jobs. Some
                                Flexn features and functionality requires the use of cookies to properly work. For the
                                purposes of this Cookie Policy, the term “cookie” includes all cookies, web beacons,
                                pixels, tags and similar technologies.
                            </p>
                            <br />
                            <p>
                                Cookies are unique to your account or your browser. There are different types of
                                cookies, including first party cookies (which are served directly by us to your computer
                                or device) and third party cookies (which are served by a third party on our behalf).
                                Third party cookies enable third party features or functionality to be provided on or
                                through the website (e.g., interactive content and analytics). The parties that set
                                these third party cookies can recognize your computer both when it visits the Site and
                                also when it visits certain other websites. Session-based cookies last only while your
                                browser is open and are automatically deleted when you close your browser. Persistent
                                cookies last until you or your browser delete them or until they expire.
                            </p>

                            <Title>Why does Flexn use cookies?</Title>
                            <p>
                                Flexn uses some cookies that are tied to your account and personal information to
                                recognize your logins and the workspaces where you are logged in. Flexn uses other
                                cookies which are not tied to your account but are unique to carry out analytics,
                                customization, and other similar tasks.
                            </p>
                            <br />
                            <p>
                                Cookies can be used to recognize you when you visit a Site or use our Services, remember
                                your preferences, and provide a personalized experience that’s consistent with your
                                settings. Cookies also make your interactions with the Site faster and more secure.
                            </p>

                            <Title>Categories of Use. Description</Title>
                            <p>
                                <b>Essential cookies.</b> These cookies are needed to provide you with the Site and
                                Services and to use some of its features, such as access to secure areas. Without these
                                cookies, we would not be able to provide you with the services that you have asked for.
                                These include authentication cookies, which help us show you the right information and
                                personalize your experience when you're signed in to our Services, and security cookies
                                that enable and support our security features and help us detect malicious activity.
                            </p>
                            <br />
                            <p>
                                <b>Performance cookies.</b> These include cookies that can tell us which language you
                                prefer and what your communications preferences are. They can also help you fill out
                                forms on our Sites more easily and provide you with features, insights, and customized
                                content.
                            </p>
                            <br />
                            <p>
                                <b>Targeting cookies.</b> We may use cookies to help us deliver marketing campaigns and
                                track their performance (e.g., a user visited our Help Center and then made a purchase).
                                Similarly, our partners may use cookies to provide us with information about your
                                interactions with their services.
                            </p>
                            <br />
                            <p>
                                <b>Analytics and Research.</b> Cookies help us learn how well our Sites and Services
                                perform. We also use cookies to understand, improve, and research products, features,
                                and services, including to create logs and record when you access our Sites and Services
                                from different devices, such as your work computer or your mobile device.
                            </p>

                            <Title>How to disable cookies</Title>
                            <p>
                                You can change your browser settings to control what cookies the browser stores. If you
                                elect not to activate a cookie or to later disable cookies, you may still visit our
                                Websites, but your ability to use some features or areas may be limited. You may opt out
                                of advertising partners’ targeted advertising using the following links:
                            </p>
                            <ul>
                                <li>
                                    {' '}
                                    <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener">
                                        http://www.aboutads.info/choices/
                                    </a>{' '}
                                    and{' '}
                                    <a
                                        href="http://www.networkadvertising.org/choices/ "
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        http://www.networkadvertising.org/choices/{' '}
                                    </a>{' '}
                                    if located in the United States
                                </li>
                                <li>
                                    <a href="http://www.youronlinechoices.eu/" target="_blank" rel="noopener">
                                        http://www.youronlinechoices.eu/
                                    </a>{' '}
                                    if located in the European Union.
                                </li>
                                <li>
                                    To see information about opt-out choices for mobile devices, visit{' '}
                                    <a
                                        href="http://www.networkadvertising.org/mobile-choices"
                                        target="_blank"
                                        rel="noopener"
                                    >
                                        http://www.networkadvertising.org/mobile-choices
                                    </a>
                                    .
                                </li>
                            </ul>
                            <p>
                                In addition, certain third party advertising networks, including Google, permit users to
                                opt out of or customize preferences associated with your internet browsing. To learn
                                more about this feature from Google, click here.
                            </p>
                            <Title>What cookies does Flexn use?</Title>
                            <p>
                                You can request a list of the cookies that Flexn uses by contacting
                                <a href="mailto:support@flexn.io">support@flexn.io</a>. Please be aware that the cookies
                                we use may depend on the features you are using and the device, browser or operating
                                system you are using. The number and names of cookies, pixels and other technologies may
                                also change from time to time.
                            </p>

                            <Title>Contact Us</Title>
                            <p>
                                If you have questions or concerns regarding this policy or about Flexn’s privacy
                                practices, please contact us by email at: <br />
                                <a href="mailto:support@flexn.io">support@flexn.io</a>
                                , or at: Flexn B.V. <br />
                                Attn: Compliance Officer <br />
                                Wormerweg 24 <br />
                                1464 NB, Westbeemster <br />
                                The Netherlands
                            </p>
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
