import type { FormState } from '@/components/ui/ActionForm';

/* ===========================================================================
   Browser side of photo uploads. Phone photos are often 4–10 MB; several
   together would pass the 12 MB request limit and fail. So each photo is
   shrunk here to the largest size the shop uses (2400 px) and sent on its
   own. The server still checks every file (type, size, pixels) itself.
   =========================================================================== */

const LONGEST_EDGE = 2400;
const SHRINK_ABOVE_BYTES = 2 * 1024 * 1024;
const MAX_BYTES = 10 * 1024 * 1024;
/** Same as the server's limit per upload. */
export const MAX_PHOTOS_AT_ONCE = 8;

/** Photo chosen in a file input, ignoring the empty entry of an unused input. */
export function chosenPhotos(input: HTMLInputElement | null): File[] {
  return Array.from(input?.files ?? []).filter((f) => f.size > 0);
}

/** A copy of the photo at most 2400 px on its longest side, as JPEG. Unreadable files are returned as they are (the server explains why it refuses them). */
async function shrink(file: File): Promise<File> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    return file;
  }
  const scale = Math.min(1, LONGEST_EDGE / Math.max(bitmap.width, bitmap.height));
  if (scale === 1 && file.size <= SHRINK_ABOVE_BYTES) {
    bitmap.close();
    return file;
  }
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.92));
  if (!blob) return file;
  return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
}

/**
 * Sends photos one at a time through `upload` (a bound uploadPhotos action),
 * reporting progress. Stops at the first problem; photos before it are kept.
 */
export async function uploadOneByOne(
  files: File[],
  upload: (state: FormState, form: FormData) => Promise<FormState>,
  onProgress: (message: string) => void,
): Promise<{ added: number; error?: string }> {
  let added = 0;
  for (const [i, original] of files.entries()) {
    onProgress(`Uploading photo ${i + 1} of ${files.length}…`);
    const file = await shrink(original);
    if (file.size > MAX_BYTES)
      return { added, error: `${original.name}: Photos must be under 10 MB.` };
    const form = new FormData();
    form.append('photos', file);
    let result: FormState;
    try {
      result = await upload({}, form);
    } catch {
      result = {
        error: `${original.name} could not be sent. Check the internet connection and try again.`,
      };
    }
    if (result.error) return { added, error: result.error };
    added += 1;
  }
  return { added };
}
