/* ===========================================================================
   LEGAL CONTENT — DRAFT PLACEHOLDERS
   ---------------------------------------------------------------------------
   None of the text below has been written or reviewed by a legal
   professional. It exists to give each policy page a sensible structure so
   that real, adviser-approved wording can be dropped in section by section.

   Before launch: replace every `body` array with approved copy, delete the
   `pending` notes, and remove the `robots: { index: false }` flag in
   app/legal/[slug]/page.tsx so the finished pages can be indexed.
   =========================================================================== */

export interface LegalSection {
  heading: string;
  body: string[];
  /** Note shown in muted type describing what still has to be decided. */
  pending?: string;
}

export interface LegalPage {
  title: string;
  summary: string;
  sections: LegalSection[];
}

export const legalPages: Record<string, LegalPage> = {
  privacy: {
    title: 'Privacy Policy',
    summary: 'What data this site collects, why, and what happens to it.',
    sections: [
      {
        heading: 'What this site currently stores',
        body: [
          'At present this site has no backend and no analytics. Your shopping bag, your wishlist and your recent searches are stored in your own browser using localStorage. That data never leaves your device and we cannot see it.',
          'Clearing your browser data clears all of it.',
        ],
      },
      {
        heading: 'Information you give us',
        body: [
          'The checkout and contact forms validate what you type in your browser. Because no server is connected yet, nothing you enter is transmitted or retained anywhere.',
          'Once ordering goes live, we will collect the name, email address, phone number and delivery address needed to fulfil an order, and we will state here exactly how long each is kept.',
        ],
        pending:
          'To be completed: retention periods, lawful basis for processing, and the identity and contact details of the data controller.',
      },
      {
        heading: 'Payment information',
        body: [
          'We do not collect, process or store card numbers, CVVs, UPI PINs or bank credentials, and we do not intend to. When payments are enabled, they will be handled entirely by a third-party payment gateway using its own secure, hosted interface.',
        ],
        pending:
          'To be completed: the name of the payment processor and a link to its privacy policy.',
      },
      {
        heading: 'Cookies and tracking',
        body: [
          'This site sets no cookies and runs no advertising or analytics trackers at the time of writing.',
        ],
        pending:
          'To be completed if analytics or advertising tools are added later, along with a consent mechanism where one is required.',
      },
      {
        heading: 'Sharing your information',
        body: [
          'We do not sell personal information. Once orders are live, data will be shared only with the parties needed to complete an order — a payment processor and a delivery partner.',
        ],
        pending: 'To be completed: the specific processors used and where they are located.',
      },
      {
        heading: 'Your rights',
        body: [
          'You are entitled to ask what personal data we hold about you, to have it corrected, and to have it deleted, subject to any legal obligation we have to retain records.',
        ],
        pending:
          'To be completed: how to make such a request, the response timeframe, and the applicable statutory framework.',
      },
    ],
  },

  terms: {
    title: 'Terms of Service',
    summary: 'The terms on which this website and, in due course, this shop are offered.',
    sections: [
      {
        heading: 'About this website',
        body: [
          'This site is operated by Kanchi Vastra. Using it means accepting the terms set out on this page.',
          'The site is currently a pre-launch build. Product listings, prices, stock figures, imagery and business details shown on it are demonstration content and do not constitute an offer to sell.',
        ],
      },
      {
        heading: 'Products and pricing',
        body: [
          'Prices shown are in Indian rupees. Because no orders can currently be placed, no price on this site is binding.',
          'Once trading begins, we will reserve the right to correct pricing or listing errors and to decline an order placed against an incorrect price, with a full refund where payment has been taken.',
        ],
        pending: 'To be completed: order acceptance, cancellation rights and tax treatment.',
      },
      {
        heading: 'Colour and the nature of handloom',
        body: [
          'Handloom sarees vary. Slight irregularities in weave and minor variation between pieces are characteristic of hand weaving and are not defects.',
          'Colour reproduction also varies between screens. We will describe colour as accurately as we can, but we cannot guarantee that a saree will appear on your device exactly as it does in person.',
        ],
      },
      {
        heading: 'Intellectual property',
        body: [
          'The Kanchi Vastra name, logo, site design, written content and original artwork on this site belong to Kanchi Vastra and may not be reproduced without permission.',
        ],
      },
      {
        heading: 'Limitation of liability',
        body: [
          'This section must be drafted by a legal professional against the applicable jurisdiction.',
        ],
        pending: 'To be completed in full. Do not launch with this section as-is.',
      },
      {
        heading: 'Governing law',
        body: ['To be confirmed.'],
        pending:
          'To be completed: governing law, jurisdiction for disputes, and any dispute-resolution process.',
      },
    ],
  },

  shipping: {
    title: 'Shipping Policy',
    summary: 'How orders will be dispatched, tracked and delivered.',
    sections: [
      {
        heading: 'Current status',
        body: [
          'Ordering is not yet open, so nothing is being dispatched. The intentions below describe how we expect shipping to work and will be replaced with firm commitments before the store opens.',
        ],
      },
      {
        heading: 'Where we ship',
        body: ['We intend to ship across India.'],
        pending:
          'To be completed: whether international shipping is offered, and any regions excluded.',
      },
      {
        heading: 'Charges',
        body: [
          'The site currently shows complimentary shipping on orders above ₹15,000 and a flat rate of ₹250 below that. These are demonstration figures.',
        ],
        pending: 'To be completed: final shipping rates, and how they are calculated.',
      },
      {
        heading: 'Dispatch and delivery times',
        body: [
          'The site currently indicates 5–7 business days from dispatch. This is a placeholder estimate, not a commitment.',
        ],
        pending:
          'To be completed: processing time before dispatch, courier partners, and realistic delivery windows by region.',
      },
      {
        heading: 'Tracking',
        body: ['We intend to provide tracking on every order.'],
        pending: 'To be completed: how tracking details are shared and when.',
      },
      {
        heading: 'Damaged or missing parcels',
        body: ['To be confirmed.'],
        pending:
          'To be completed: the claims process, the window for reporting, and evidence required.',
      },
    ],
  },

  returns: {
    title: 'Returns Policy',
    summary: 'When a saree can be returned or exchanged, and how.',
    sections: [
      {
        heading: 'Current status',
        body: [
          'No orders can be placed yet, so no returns arise. The position below is provisional and will be finalised before the store opens.',
        ],
      },
      {
        heading: 'What can be returned',
        body: [
          'We intend to accept returns on sarees that are unworn, unwashed, and in their original condition with all tags intact.',
          'Sarees that have been altered, stitched, or had a fall or blouse attached cannot be returned, because those changes cannot be undone.',
        ],
      },
      {
        heading: 'Return window',
        body: ['To be confirmed.'],
        pending:
          'To be completed: the number of days from delivery within which a return may be initiated.',
      },
      {
        heading: 'How to start a return',
        body: ['To be confirmed.'],
        pending:
          'To be completed: the contact route, whether pickup is arranged, and who bears return shipping.',
      },
      {
        heading: 'Refunds',
        body: ['Where a return is accepted, we intend to refund to the original payment method.'],
        pending:
          'To be completed: processing time, whether shipping charges are refunded, and the treatment of partial returns.',
      },
      {
        heading: 'Damaged or incorrect items',
        body: [
          'If a saree arrives damaged or is not what was ordered, we will put it right at our cost.',
        ],
        pending: 'To be completed: reporting window and evidence required.',
      },
    ],
  },
};
