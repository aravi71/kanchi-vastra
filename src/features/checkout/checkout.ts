/* ===========================================================================
   CHECKOUT CONTRACT
   ---------------------------------------------------------------------------
   The shipping form is fully built and validated. Payment is NOT enabled and
   no gateway is wired up. This module defines the seam a gateway will plug
   into later, so adding Razorpay (or Stripe, or Cashfree) is an additive
   change rather than a rewrite of the checkout UI.

   WHEN ADDING RAZORPAY
   --------------------
   1. Put NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local.
      The secret is server-only and must never be imported into a component.
   2. Create app/api/checkout/create-order/route.ts. It receives the validated
      address plus the cart line ids, recomputes the total SERVER-SIDE from
      the catalogue (never trust a total sent by the browser), calls
      Razorpay Orders API, and returns { orderId, amount, currency }.
   3. Create app/api/checkout/verify/route.ts. It receives the handler payload
      and verifies razorpay_signature with HMAC-SHA256 over
      `${razorpay_order_id}|${razorpay_payment_id}` keyed by RAZORPAY_KEY_SECRET.
      Only mark an order paid inside this route.
   4. Add app/api/webhooks/razorpay/route.ts, verifying the payload against
      RAZORPAY_WEBHOOK_SECRET, as the authoritative source for payment state.
   5. Replace `submitOrder` below so it calls step 2, opens Razorpay Checkout,
      and hands the handler response to step 3.

   Card numbers, CVVs and UPI PINs are collected by the gateway's own hosted
   widget. They must never touch this codebase.
   =========================================================================== */

import type { CartLine } from '@/types/catalog';

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes?: string;
}

export type FieldErrors = Partial<Record<keyof ShippingAddress, string>>;

/** Indian states and union territories, for the checkout state field. */
export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Lakshadweep', 'Puducherry',
] as const;

/**
 * Validate the shipping form. Returns an empty object when the address is
 * usable. Kept framework-free so the same rules can run again on the server
 * once an order API exists — client validation is a convenience, never a
 * security boundary.
 */
export function validateAddress(values: ShippingAddress): FieldErrors {
  const errors: FieldErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter the recipient’s full name.';
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  // Indian mobile numbers are ten digits beginning 6–9; an optional +91 is allowed.
  const phone = values.phone.replace(/[\s-]/g, '').replace(/^\+?91/, '');
  if (!/^[6-9]\d{9}$/.test(phone)) {
    errors.phone = 'Please enter a 10-digit Indian mobile number.';
  }
  if (values.address.trim().length < 8) {
    errors.address = 'Please enter the full street address.';
  }
  if (values.city.trim().length < 2) {
    errors.city = 'Please enter a city.';
  }
  if (!values.state) {
    errors.state = 'Please select a state.';
  }
  // Indian PIN codes are six digits and never start with zero.
  if (!/^[1-9]\d{5}$/.test(values.pincode.trim())) {
    errors.pincode = 'Please enter a valid 6-digit PIN code.';
  }

  return errors;
}

export type OrderResult =
  | { status: 'payment-unavailable'; reference: string }
  | { status: 'ok'; orderId: string }
  | { status: 'error'; message: string };

/**
 * Placeholder order submission.
 *
 * Deliberately does NOT claim an order was placed — no gateway exists, no
 * order is persisted, and nothing is charged. It returns a local reference so
 * the confirmation screen can be honest about what did and did not happen.
 */
export async function submitOrder(
  _address: ShippingAddress,
  _lines: CartLine[],
): Promise<OrderResult> {
  const reference = `KV-${Date.now().toString(36).toUpperCase()}`;
  return { status: 'payment-unavailable', reference };
}
