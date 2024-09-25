// src/templates/Hero.tsx
import { useTranslations } from 'next-intl';
import { buttonVariants } from '@/components/ui/button';
import { CenteredHero } from '@/features/landing/CenteredHero';
import { Section } from '@/features/landing/Section';
import Link from 'next/link';


type HeroProps = {
  namespace: string;
};

const Hero = ({ namespace }: HeroProps) => {
  const t = useTranslations(namespace);

  return (
    <Section className="py-36">
      <CenteredHero
        title={t.rich('Hero.title', {
          important: (chunks) => (
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {chunks}
            </span>
          ),
        })}
        description={t('Hero.description')}
        buttons={
          <>
            <Link className={buttonVariants({ size: 'lg' })} href="/sign-up">Sign up</Link>
          </>
        }
      />
    </Section>
  );
};

export { Hero };
