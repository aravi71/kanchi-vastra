'use client';

import { useActionState, type ReactNode } from 'react';
import { categories, colorFamilies, fabrics } from '@/content/collections';
import { keepValues, type FormState } from '@/components/ui/ActionForm';
import { cn } from '@/lib/utils';

export interface ProductFormValues {
  name: string;
  slug: string;
  sku: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  category: string;
  collections: string[];
  colorName: string;
  colorHex: string;
  colorFamily: string;
  fabric: string;
  shortDescription: string;
  description: string;
  specs: Record<'length' | 'width' | 'blouse' | 'zari' | 'weight' | 'weave' | 'care', string>;
  isFeatured: boolean;
  isNewArrival: boolean;
  sortOrder: string;
}

const COLLECTIONS = [
  { slug: 'kanchipuram', label: 'Kanchipuram Silks' },
  { slug: 'bridal', label: 'Bridal Silks' },
  { slug: 'festive', label: 'Festive' },
  { slug: 'everyday', label: 'Everyday Elegance' },
];

const input =
  'mt-1.5 block w-full rounded-md border border-ivory-300 bg-white px-3 py-2 text-sm focus:border-wine-700 focus:ring-2 focus:ring-wine-700/15 focus:outline-none';

function Row({
  label,
  name,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  name: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={name} className="text-sm font-medium text-ink-800">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-red-700">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-400">{hint}</p>
      ) : null}
    </div>
  );
}

/** The saree editor: every field the shop shows, validated again on the server. */
export function ProductForm({
  action,
  values,
  isNew,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  values: ProductFormValues;
  isNew: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {} as FormState);
  const e = state.fieldErrors ?? {};

  return (
    <form onSubmit={keepValues(formAction)} className="space-y-6" noValidate>
      <section className="rounded-lg border border-ivory-300 bg-white p-5 md:p-6">
        <h2 className="eyebrow-sm mb-5 text-ink-500">Price &amp; stock</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Row label="Saree name" name="name" error={e.name} className="md:col-span-2">
            <input
              id="name"
              name="name"
              defaultValue={values.name}
              required
              maxLength={120}
              className={input}
            />
          </Row>
          <Row label="Price (₹)" name="price" hint="Just the number, e.g. 18500" error={e.price}>
            <input
              id="price"
              name="price"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              defaultValue={values.price}
              required
              className={cn(input, 'tnum')}
            />
          </Row>
          <Row
            label="Was price (₹, optional)"
            name="compareAtPrice"
            hint="Shown struck through. Only if it truly sold at this price."
            error={e.compareAtPrice}
          >
            <input
              id="compareAtPrice"
              name="compareAtPrice"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              defaultValue={values.compareAtPrice}
              className={cn(input, 'tnum')}
            />
          </Row>
          <Row
            label="How many in stock"
            name="stock"
            hint="0 shows “Sold out”. 1–2 shows “Only N left”."
            error={e.stock}
          >
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              inputMode="numeric"
              defaultValue={values.stock}
              required
              className={cn(input, 'tnum')}
            />
          </Row>
          <Row
            label="Stock code (SKU)"
            name="sku"
            hint="Your own code, e.g. KV-KAN-021. Must be unique."
            error={e.sku}
          >
            <input
              id="sku"
              name="sku"
              defaultValue={values.sku}
              required
              maxLength={40}
              className={cn(input, 'font-mono uppercase')}
            />
          </Row>
          <Row
            label="Status"
            name="status"
            hint="Only “On sale” sarees appear in the shop."
            error={e.status}
          >
            <select id="status" name="status" defaultValue={values.status} className={input}>
              <option value="ACTIVE">On sale</option>
              <option value="DRAFT">Draft (hidden, still being prepared)</option>
              <option value="ARCHIVED">Archived (hidden, no longer sold)</option>
            </select>
          </Row>
          <Row
            label="Web address"
            name="slug"
            hint={
              isNew
                ? 'Leave empty to make one from the name.'
                : 'Changing it breaks links people have shared. Avoid.'
            }
            error={e.slug}
          >
            <input
              id="slug"
              name="slug"
              defaultValue={values.slug}
              maxLength={80}
              className={cn(input, 'font-mono')}
            />
          </Row>
        </div>
      </section>

      <section className="rounded-lg border border-ivory-300 bg-white p-5 md:p-6">
        <h2 className="eyebrow-sm mb-5 text-ink-500">Description</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Row
            label="Short description"
            name="shortDescription"
            hint="One or two lines for the shop grid."
            error={e.shortDescription}
            className="md:col-span-2"
          >
            <textarea
              id="shortDescription"
              name="shortDescription"
              defaultValue={values.shortDescription}
              maxLength={300}
              rows={2}
              className={input}
            />
          </Row>
          <Row
            label="Longer description"
            name="description"
            error={e.description}
            className="md:col-span-2"
          >
            <textarea
              id="description"
              name="description"
              defaultValue={values.description}
              maxLength={5000}
              rows={5}
              className={input}
            />
          </Row>
          <Row
            label="Colour name"
            name="colorName"
            hint="As you would say it, e.g. Ruby Red"
            error={e.colorName}
          >
            <input
              id="colorName"
              name="colorName"
              defaultValue={values.colorName}
              maxLength={40}
              className={input}
            />
          </Row>
          <Row label="Colour swatch" name="colorHex" error={e.colorHex}>
            <input
              id="colorHex"
              name="colorHex"
              type="color"
              defaultValue={values.colorHex}
              className="mt-1.5 block h-10 w-24 cursor-pointer rounded-md border border-ivory-300 bg-white p-1"
            />
          </Row>
          <Row label="Colour filter group" name="colorFamily" error={e.colorFamily}>
            <select
              id="colorFamily"
              name="colorFamily"
              defaultValue={values.colorFamily}
              className={input}
            >
              {colorFamilies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Row>
          <Row label="Fabric" name="fabric" error={e.fabric}>
            <select id="fabric" name="fabric" defaultValue={values.fabric} className={input}>
              {fabrics.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </Row>
        </div>
      </section>

      <section className="rounded-lg border border-ivory-300 bg-white p-5 md:p-6">
        <h2 className="eyebrow-sm mb-5 text-ink-500">Measurements &amp; care</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {(
            [
              ['length', 'Length'],
              ['width', 'Width'],
              ['blouse', 'Blouse piece'],
              ['zari', 'Zari'],
              ['weight', 'Weight'],
              ['weave', 'Weave'],
            ] as const
          ).map(([key, label]) => {
            const name = `spec${key[0].toUpperCase()}${key.slice(1)}`;
            return (
              <Row key={key} label={label} name={name} error={e[name]}>
                <input
                  id={name}
                  name={name}
                  defaultValue={values.specs[key]}
                  maxLength={160}
                  className={input}
                />
              </Row>
            );
          })}
          <Row label="Care" name="specCare" error={e.specCare} className="md:col-span-2">
            <textarea
              id="specCare"
              name="specCare"
              defaultValue={values.specs.care}
              maxLength={400}
              rows={2}
              className={input}
            />
          </Row>
        </div>
      </section>

      <section className="rounded-lg border border-ivory-300 bg-white p-5 md:p-6">
        <h2 className="eyebrow-sm mb-5 text-ink-500">Where it appears</h2>
        <div className="grid gap-5 md:grid-cols-2">
          <Row label="Main collection" name="category" error={e.category}>
            <select id="category" name="category" defaultValue={values.category} className={input}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </Row>
          <Row
            label="Sort position"
            name="sortOrder"
            hint="Lower numbers show first."
            error={e.sortOrder}
          >
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min="0"
              step="1"
              defaultValue={values.sortOrder}
              className={cn(input, 'tnum')}
            />
          </Row>
          <fieldset className="md:col-span-2">
            <legend className="text-sm font-medium text-ink-800">Also show in</legend>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {COLLECTIONS.map((c) => (
                <label key={c.slug} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="collections"
                    value={c.slug}
                    defaultChecked={values.collections.includes(c.slug)}
                    className="size-4 accent-wine-800"
                  />
                  {c.label}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isFeatured"
              defaultChecked={values.isFeatured}
              className="size-4 accent-wine-800"
            />
            Show on the homepage (signature pieces)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="isNewArrival"
              defaultChecked={values.isNewArrival}
              className="size-4 accent-wine-800"
            />
            Mark as “New”
          </label>
        </div>
      </section>

      <div className="sticky bottom-0 -mx-5 flex flex-wrap items-center gap-4 border-t border-ivory-300 bg-[#f4f1ec]/95 px-5 py-4 backdrop-blur md:-mx-10 md:px-10">
        <button
          type="submit"
          disabled={pending}
          className="h-11 rounded-md bg-wine-800 px-6 text-sm font-medium text-ivory-50 hover:bg-wine-950 disabled:opacity-60"
        >
          {pending ? 'Saving…' : isNew ? 'Create saree' : 'Save changes'}
        </button>
        {state.ok && (
          <p role="status" className="text-sm text-emerald-800">
            {state.ok}
          </p>
        )}
        {state.error && (
          <p role="alert" className="text-sm text-red-700">
            {state.error}
          </p>
        )}
      </div>
    </form>
  );
}
