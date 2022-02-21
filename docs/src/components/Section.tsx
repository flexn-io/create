import React from 'react';
import Separator from './Separator';
import Subtitle from './Subtitle';
import Title from './Title';

type SectionProps = {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    separator?: boolean;
};

export default function Section({ children, title, subtitle, separator }: SectionProps): JSX.Element {
    return (
        <section>
            <div className="section-head">
                <Title>{title}</Title>
                <Subtitle>{subtitle}</Subtitle>
            </div>
            <div className="section-content">{children}</div>
            {separator && <Separator />}
            <style>{`
        .section-head {
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          max-width: 625px;
          margin: 0 auto;
        }
        .section-content {
          display: flex;
          width: 100%;
          align-items: center;
          justify-content: center;
          margin-top: 96px;
        }

        @media (max-width: 768px) {
          .section-content {
            flex-direction: column;
            margin-top: 32px;
          }
  
        }
      `}</style>
        </section>
    );
}
