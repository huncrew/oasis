"use client";

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { PriceId } from '@/components/CheckoutForm';
import { buttonVariants } from '@/components/ui/button';
import { PricingInformation } from '@/features/billing/PricingInformation';
import { Section } from '@/features/landing/Section';
import { PLAN_ID } from '@/utils/AppConfig';
import { Navbar } from '@/templates/Navbar';
import CheckoutForm from '@/components/CheckoutForm'; // Import the checkout form

type PricingProps = {
  namespace: string;
};

const Pricing: React.FC<PricingProps> = ({ namespace = 'CustomerFeedback' }) => {
  const t = useTranslations(namespace);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<PriceId | null>(null);

  const handleCheckout = (priceId: PriceId) => {
    setSelectedPriceId(priceId);
    setShowCheckout(true);
  };

  return (
    <>
      <Navbar namespace={namespace} />
      <Section
        subtitle={t('Pricing.section_subtitle')}
        title={t('Pricing.section_title')}
        description={t('Pricing.section_description')}
      >
        {showCheckout && selectedPriceId ? (
          <CheckoutForm priceId={selectedPriceId} />
        ) : (
          <PricingInformation
            namespace={namespace}
            buttonList={{
              [PLAN_ID.FREE]: (
                <button
                  className={buttonVariants({
                    size: 'sm',
                    className: 'mt-5 w-full',
                  })}
                  onClick={() => handleCheckout('price_free')}
                >
                  {t('Pricing.button_text')}
                </button>
              ),
              [PLAN_ID.PREMIUM]: (
                <button
                  className={buttonVariants({
                    size: 'sm',
                    className: 'mt-5 w-full',
                  })}
                  onClick={() => handleCheckout('price_premium')}
                >
                  {t('Pricing.button_text')}
                </button>
              ),
              [PLAN_ID.ENTERPRISE]: (
                <button
                  className={buttonVariants({
                    size: 'sm',
                    className: 'mt-5 w-full',
                  })}
                  onClick={() => handleCheckout('price_enterprise')}
                >
                  {t('Pricing.button_text')}
                </button>
              ),
            }}
          />
        )}
      </Section>
    </>
  );
};

export default Pricing;
