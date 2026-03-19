'use client';

import Image from 'next/image';

interface PartnersSectionProps {
  title?: string;
  subtitle?: string;
}

export function PartnersSection({
  title = 'Our Partners & Funders',
  subtitle = 'The restoration of the bog at Glashapullagh is first and foremost the achievement of the farmer, it was his vision and desire to restore the bog that made this possible. The work was carried as a training and capacity building initiative by the staff of ACRES Munster South Connacht with the support of their colleagues from ACRES Breifne and ACRES Leinster and was funded by Wild Atlantic Nature. ACRES Co-operation teams are fully funded by the Dept. of Agriculture, Food and the Marine as part of Irelands CAP Strategic Plan.',
}: PartnersSectionProps) {
  return (
    <section
      style={{
        padding: '3rem 2rem 2rem',
        borderTop: '1px solid var(--gold-dim)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--gold)',
              marginBottom: '0.75rem',
            }}
          >
            Supported By
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: 'var(--cream)',
              marginBottom: '1rem',
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.7,
              maxWidth: '700px',
              margin: '0 auto',
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Partner logos banner */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '1.5rem 0',
        }}>
          <Image
            src="/images/partners/partner-logos-banner.png"
            alt="ACRES, Department of Agriculture Food and the Marine, European Union, Wild Atlantic Nature LIFE, Natura 2000, NPWS, EU LIFE Programme"
            width={1167}
            height={101}
            style={{
              width: '100%',
              maxWidth: '900px',
              height: 'auto',
              objectFit: 'contain',
            }}
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
