import { Monogram } from '@/components/ui/Logo';

export default function Loading() {
  return (
    <div className="flex min-h-[70svh] items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <Monogram className="animate-pulse text-gold-500/70" size={40} />
        <span className="eyebrow-sm text-ink-400" role="status">
          Loading
        </span>
      </div>
    </div>
  );
}
