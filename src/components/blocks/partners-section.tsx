'use client';

import Image from 'next/image';

interface Partner {
  name: string;
  logo: string;
  url?: string;
}

interface PartnersSectionProps {
  title?: string;
  subtitle?: string;
  partners?: Partner[];
}

const defaultPartners: Partner[] = [
  {
    name: 'EU LIFE Programme',
    logo: '/images/partners/eu-life.png',
    url: 'https://cinea.ec.europa.eu/programmes/life_en',
  },
  {
    name: 'Natura 2000',
    logo: '/images/partners/natura-2000.png',
    url: 'https://ec.europa.eu/environment/nature/natura2000/',
  },
  {
    name: 'National Parks and Wildlife Service',
    logo: '/images/partners/npws.png',
    url: 'https://www.npws.ie/',
  },
  {
    name: 'Wild Atlantic Nature LIFE',
    logo: '/images/partners/wild-atlantic-nature.png',
    url: 'https://www.wildatlanticnature.ie/',
  },
];

export function PartnersSection({
  title = 'Our Partners & Funders',
  subtitle = 'This restoration project is made possible through the support of our partners and EU funding programmes.',
  partners = defaultPartners,
}: PartnersSectionProps) {
  return (
    <section
      className="py-16 px-4 md:px-8 lg:px-16"
      style={{ background: 'var(--bg-card)' }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-10 text-center">
          <p
            className="text-sm font-medium tracking-wider uppercase mb-3"
            style={{
              fontFamily: 'var(--font-ui)',
              color: 'var(--gold-dim)',
            }}
          >
            Supported By
          </p>
          <h2
            className="text-2xl md:text-3xl font-bold mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--cream)',
            }}
          >
            {title}
          </h2>
          <p
            className="max-w-2xl mx-auto text-base"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
            }}
          >
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16">
          {partners.map((partner, index) => {
            const inner = (
              <div
                key={index}
                className="flex items-center justify-center px-4 py-3 rounded-lg transition-opacity duration-300 hover:opacity-100 opacity-70"
                style={{ minHeight: '80px' }}
              >
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  width={160}
                  height={80}
                  className="max-h-16 md:max-h-20 w-auto object-contain brightness-90 hover:brightness-100 transition-all duration-300"
                  style={{ filter: 'grayscale(20%)' }}
                />
              </div>
            );

            if (partner.url) {
              return (
                <a
                  key={index}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={partner.name}
                >
                  {inner}
                </a>
              );
            }

            return inner;
          })}
        </div>
      </div>
    </section>
  );
}
