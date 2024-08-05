// components/CheckoutForm.tsx

import React, { useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

export type PriceId = string;

type CheckoutFormProps = {
    priceId: PriceId;
  };

const CheckoutForm: React.FC<CheckoutFormProps>  = ({ priceId }) => {
  const fetchClientSecret = useCallback(() => {
    return fetch(`${process.env.NEXT_PUBLIC_AWS_API_URL}/stripe-checkout`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    })
    .then((res) => res.json())
    .then((data) => data.clientSecret);
  }, [priceId]);

  const options = { fetchClientSecret };

  return (
    <div id="checkout">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={options}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
};

export default CheckoutForm;
