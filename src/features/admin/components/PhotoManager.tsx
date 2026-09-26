'use client';

import Image from 'next/image';
import { useActionState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from 'lucide-react';
import type { FormState } from '@/components/ui/ActionForm';
import { movePhoto, removePhoto } from '@/features/admin/actions/products';

export interface PhotoItem {
  id: string;
  url: string;
}

/** Upload, reorder and delete a saree's photos. The first photo is the main one. */
export function PhotoManager({
  photos,
  upload,
}: {
  photos: PhotoItem[];
  upload: (state: FormState, form: FormData) => Promise<FormState>;
}) {
  const [state, formAction, pending] = useActionState(upload, {} as FormState);

  return (
    <section className="rounded-lg border border-ivory-300 bg-white p-5 md:p-6">
      <h2 className="eyebrow-sm mb-1 text-ink-500">Photos</h2>
      <p className="mb-5 text-xs text-ink-400">
        The first photo is the main one in the shop. Best: 4 portrait photos — full saree, border,
        pallu, close-up.
      </p>

      {photos.length > 0 ? (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p, i) => (
            <li key={p.id} className="overflow-hidden rounded-md border border-ivory-300">
              <div className="relative aspect-[3/4] bg-ivory-100">
                <Image src={p.url} alt="" fill sizes="200px" className="object-cover" />
                {i === 0 && (
                  <span className="absolute top-2 left-2 rounded bg-wine-800 px-2 py-0.5 text-[10px] font-medium text-ivory-50">
                    Main photo
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between bg-ivory-50 px-2 py-1.5">
                <div className="flex gap-1">
                  <form action={movePhoto}>
                    <input type="hidden" name="imageId" value={p.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      disabled={i === 0}
                      aria-label="Move earlier"
                      className="rounded p-1.5 hover:bg-ivory-200 disabled:opacity-30"
                    >
                      <ArrowUp className="size-4" />
                    </button>
                  </form>
                  <form action={movePhoto}>
                    <input type="hidden" name="imageId" value={p.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      disabled={i === photos.length - 1}
                      aria-label="Move later"
                      className="rounded p-1.5 hover:bg-ivory-200 disabled:opacity-30"
                    >
                      <ArrowDown className="size-4" />
                    </button>
                  </form>
                </div>
                <form
                  action={removePhoto}
                  onSubmit={(ev) => {
                    if (!confirm('Delete this photo? This cannot be undone.')) ev.preventDefault();
                  }}
                >
                  <input type="hidden" name="imageId" value={p.id} />
                  <button
                    aria-label="Delete photo"
                    className="rounded p-1.5 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-md border border-dashed border-ivory-400 p-6 text-center text-sm text-ink-500">
          No photos yet.
        </p>
      )}

      <form
        action={formAction}
        className="mt-6 flex flex-wrap items-center gap-3 rounded-md border border-dashed border-ivory-400 bg-ivory-50 p-4"
      >
        <ImagePlus className="size-5 text-ink-400" />
        <label className="text-sm">
          <span className="sr-only">Choose photos</span>
          <input
            type="file"
            name="photos"
            accept="image/jpeg,image/png,image/webp"
            multiple
            required
            className="text-sm file:mr-3 file:rounded-md file:border-0 file:bg-ink-900 file:px-3 file:py-2 file:text-sm file:text-ivory-50"
          />
        </label>
        <button
          type="submit"
          disabled={pending}
          className="h-9 rounded-md bg-wine-800 px-4 text-sm text-ivory-50 hover:bg-wine-950 disabled:opacity-60"
        >
          {pending ? 'Uploading… (sizing for phones and computers)' : 'Upload photos'}
        </button>
        <p className="w-full text-xs text-ink-400">
          JPG, PNG or WebP · up to 10 MB each · location data is removed automatically.
        </p>
        {state.ok && (
          <p role="status" className="w-full text-sm text-emerald-800">
            {state.ok}
          </p>
        )}
        {state.error && (
          <p role="alert" className="w-full text-sm text-red-700">
            {state.error}
          </p>
        )}
      </form>
    </section>
  );
}
