'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Info, Lock, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/store/cart';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Field, Select, TextArea, TextInput } from '@/components/ui/Field';
import { OrderSummary } from '@/components/cart/OrderSummary';
import {
  INDIAN_STATES,
  submitOrder,
  validateAddress,
  type FieldErrors,
  type ShippingAddress,
} from '@/lib/checkout';
import { formatPrice } from '@/lib/utils';

const blank: ShippingAddress = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  notes: '',
};

export function CheckoutForm() {
  const { items, lines, total, hydrated, clear } = useCart();
  const [values, setValues] = useState<ShippingAddress>(blank);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const set = (key: keyof ShippingAddress) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateAddress(values);
    setErrors(found);

    if (Object.keys(found).length > 0) {
      // Move focus to the first field that failed, so keyboard and screen
      // reader users are not left guessing where the problem is.
      const firstKey = Object.keys(found)[0];
      const el = document.querySelector<HTMLElement>(`[data-field="${firstKey}"]`);
      el?.focus();
      return;
    }

    setSubmitting(true);
    const result = await submitOrder(values, lines);
    setSubmitting(false);

    if (result.status === 'payment-unavailable') {
      setReference(result.reference);
      summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  if (!hydrated) {
    return (
      <div className="container-editorial pb-24">
        <div className="h-80 animate-pulse bg-ivory-200/60" />
      </div>
    );
  }

  /* --- nothing to check out ------------------------------------------- */
  if (items.length === 0 && !reference) {
    return (
      <div className="container-editorial pb-24 md:pb-32">
        <div className="border border-dashed border-ivory-400 px-8 py-24 text-center">
          <ShoppingBag className="mx-auto size-10 text-ivory-400" strokeWidth={0.8} />
          <h2 className="display-md mt-6 font-light">There is nothing to check out</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
            Add a saree to your bag first and this page will be waiting.
          </p>
          <ButtonLink href="/shop" className="mt-8">
            Explore the Collection
          </ButtonLink>
        </div>
      </div>
    );
  }

  /* --- details captured, payment not available ------------------------ */
  if (reference) {
    return (
      <div className="container-editorial pb-24 md:pb-32">
        <div className="mx-auto max-w-2xl border border-ivory-300 bg-ivory-200/40 p-8 md:p-12">
          <p className="eyebrow text-wine-700">Payment gateway coming soon</p>
          <h2 className="display-md mt-5 font-light">Your order has not been placed</h2>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-ink-600">
            <p>
              Online payments are not yet enabled on this site, so nothing has been charged and
              no order has been created. Your bag has been left untouched.
            </p>
            <p>
              Your details were validated locally and were <strong>not</strong> transmitted
              anywhere — there is no server behind this form yet.
            </p>
          </div>

          <dl className="mt-8 space-y-2.5 border-y border-ivory-300 py-6 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Local reference</dt>
              <dd className="tnum">{reference}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Bag total</dt>
              <dd className="tnum">{formatPrice(total)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-ink-400">Deliver to</dt>
              <dd className="text-right">
                {values.city}, {values.state} {values.pincode}
              </dd>
            </div>
          </dl>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/shop">Continue Shopping</ButtonLink>
            <ButtonLink href="/contact" variant="secondary">
              Contact Us
            </ButtonLink>
            <Button
              variant="ghost"
              className="px-0"
              onClick={() => {
                clear();
                setReference(null);
                setValues(blank);
              }}
            >
              <span className="link-underline">Empty my bag</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* --- the form -------------------------------------------------------- */
  return (
    <div className="container-editorial pb-24 md:pb-32">
      <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <form onSubmit={handleSubmit} noValidate>
          <fieldset>
            <legend className="eyebrow text-wine-700">Contact</legend>
            <div className="mt-7 grid gap-7 sm:grid-cols-2">
              <Field label="Full name" required error={errors.name} className="sm:col-span-2">
                {(a) => (
                  <TextInput
                    {...a}
                    data-field="name"
                    name="name"
                    autoComplete="name"
                    value={values.name}
                    onChange={set('name')}
                    invalid={Boolean(errors.name)}
                    placeholder="Recipient's full name"
                  />
                )}
              </Field>

              <Field label="Email" required error={errors.email}>
                {(a) => (
                  <TextInput
                    {...a}
                    data-field="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={values.email}
                    onChange={set('email')}
                    invalid={Boolean(errors.email)}
                    placeholder="you@example.com"
                  />
                )}
              </Field>

              <Field
                label="Phone"
                required
                error={errors.phone}
                hint="10-digit Indian mobile number"
              >
                {(a) => (
                  <TextInput
                    {...a}
                    data-field="phone"
                    type="tel"
                    name="phone"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={values.phone}
                    onChange={set('phone')}
                    invalid={Boolean(errors.phone)}
                    placeholder="98765 43210"
                  />
                )}
              </Field>
            </div>
          </fieldset>

          <fieldset className="mt-12">
            <legend className="eyebrow text-wine-700">Delivery Address</legend>
            <div className="mt-7 grid gap-7 sm:grid-cols-2">
              <Field
                label="Address"
                required
                error={errors.address}
                className="sm:col-span-2"
              >
                {(a) => (
                  <TextArea
                    {...a}
                    data-field="address"
                    name="address"
                    autoComplete="street-address"
                    value={values.address}
                    onChange={set('address')}
                    invalid={Boolean(errors.address)}
                    placeholder="Flat / house number, street, area, landmark"
                  />
                )}
              </Field>

              <Field label="City" required error={errors.city}>
                {(a) => (
                  <TextInput
                    {...a}
                    data-field="city"
                    name="city"
                    autoComplete="address-level2"
                    value={values.city}
                    onChange={set('city')}
                    invalid={Boolean(errors.city)}
                  />
                )}
              </Field>

              <Field label="State" required error={errors.state}>
                {(a) => (
                  <Select
                    {...a}
                    data-field="state"
                    name="state"
                    autoComplete="address-level1"
                    value={values.state}
                    onChange={set('state')}
                    invalid={Boolean(errors.state)}
                  >
                    <option value="">Select a state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                )}
              </Field>

              <Field label="PIN code" required error={errors.pincode}>
                {(a) => (
                  <TextInput
                    {...a}
                    data-field="pincode"
                    name="pincode"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="postal-code"
                    value={values.pincode}
                    onChange={set('pincode')}
                    invalid={Boolean(errors.pincode)}
                    placeholder="600001"
                  />
                )}
              </Field>

              <Field label="Delivery notes" className="sm:col-span-2">
                {(a) => (
                  <TextArea
                    {...a}
                    name="notes"
                    value={values.notes}
                    onChange={set('notes')}
                    placeholder="Anything we should know about the delivery (optional)"
                  />
                )}
              </Field>
            </div>
          </fieldset>

          {/* --- payment: explicitly not available ---------------------- */}
          <fieldset className="mt-12">
            <legend className="eyebrow text-wine-700">Payment</legend>
            <div className="mt-7 flex gap-4 border border-ivory-400 bg-ivory-200/50 p-6">
              <Info className="mt-0.5 size-5 shrink-0 text-gold-600" strokeWidth={1.3} />
              <div className="text-sm leading-relaxed text-ink-600">
                <p className="eyebrow-sm text-ink-900">Payment gateway coming soon</p>
                <p className="mt-2.5">
                  Online payment is not yet enabled. Submitting this form will validate your
                  details and show you a local reference — it will not create an order or charge
                  anything.
                </p>
                <p className="mt-2.5 text-ink-400">
                  We never ask for card numbers, CVVs or UPI PINs on this site. When payments go
                  live they will be handled entirely by the gateway&rsquo;s own secure widget.
                </p>
              </div>
            </div>
          </fieldset>

          <div className="mt-10" ref={summaryRef}>
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={submitting}>
              <Lock className="size-4" strokeWidth={1.5} />
              {submitting ? 'Checking…' : 'Review Order'}
            </Button>
            <p className="mt-4 text-xs leading-relaxed text-ink-400">
              By continuing you agree to our{' '}
              <Link href="/legal/terms" className="link-underline text-ink-600">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/legal/privacy" className="link-underline text-ink-600">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </form>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <OrderSummary showLines />
        </aside>
      </div>
    </div>
  );
}
