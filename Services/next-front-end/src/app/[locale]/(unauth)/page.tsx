import { getTranslations } from 'next-intl/server';

import { CTA } from '@/templates/CTA';
import { FAQ } from '@/templates/FAQ';
import { Features } from '@/templates/Features';
import { Footer } from '@/templates/Footer';
import { Hero } from '@/templates/Hero';
import { Navbar } from '@/templates/Navbar';
import { Pricing } from '@/templates/Pricing';
import { Sponsors } from '@/templates/Sponsors';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function IndexPage() {
  return (
    <>
      <Navbar namespace="CustomerFeedback"/>
      <Hero namespace="CustomerFeedback" />
      <Sponsors namespace="CustomerFeedback" />
      <Features namespace="CustomerFeedback" />
      <Pricing namespace="CustomerFeedback" />
      <FAQ namespace="CustomerFeedback" />
      <CTA namespace="CustomerFeedback" />
      <Footer namespace="CustomerFeedback" />
    </>
  );
}
