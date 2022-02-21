import clsx from 'clsx';
import React from 'react';
import Image from './Image';
import Section from './Section';

export default function Showcases(): JSX.Element {
    return (
        <Section
            title="Showcases"
            subtitle="There are many variations of passages of Lorem Ipsum available, but the majority
        have suffered alteration in some form."
            separator
        >
            <div className="showcases">
                <div className="row">
                    <div className={clsx('showcases-left', 'image-box')}>
                        <Image className="showcases-left-image" src="/img/Showcase1.svg" />
                    </div>
                    <div className="showcases-right">
                        <div className={clsx('showcase-right', 'image-box')}>
                            <Image className="showcases-right-image" src="/img/Showcase2.svg" height="80%" />
                        </div>
                        <div className={clsx('showcase-right', 'image-box')}>
                            <Image className="showcases-right-image" src="/img/Showcase3.svg" />
                        </div>
                    </div>
                </div>
                <a className={clsx('see-more', 'row')} href="INSERT URL HERE">
                    <p className="url">See More</p>
                    <img className="link-icon" src="/img/linkicon.svg" />
                </a>
            </div>
            <style>{`
             a {
                color: #0060B6;
                text-decoration: none;
            }
            a:hover {
                color: #0060B6;
                text-decoration:none; 
                cursor:pointer;  
            }
                .showcases {
                    width: 75%;
                }
                .row {
                    display: flex;
                    flex-direction: row;
                }
                .image-box {
                    background: linear-gradient(0deg, #FFFFFF, #FFFFFF);
                    border: 1px solid #E4E4E4;
                    box-sizing: border-box;
                    margin: 15px;
                }
                .showcases-left {
                    display: flex;
                    width: 55%;
                    height: 400px;
                    align-items: flex-end;
                }
                .showcases-right {
                    width: 20%;
                }
                .showcases-left-image {
                    margin: 0 auto;
                    width: 65%;
                }
                .showcase-right {
                    display: flex;
                    width: 300px;
                    height: 193px;
                    left: 1100px;
                    align-items: center;
                    justify-content: center;
                }
                .see-more {
                    width: 100%;
                    justify-content: center;
                    align-items: center;
                }
            `}</style>
        </Section>
    );
}
