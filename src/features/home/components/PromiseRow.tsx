import { Lock, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { promises } from '@/features/home/content';

const ICONS = { sparkles: Sparkles, shield: ShieldCheck, truck: Truck, lock: Lock } as const;

/** Four promises between two diamond rules. */
export function PromiseRow() {
  return (
    <div className="container-editorial py-14 md:py-20">
      <div className="divider-diamond mx-auto max-w-5xl">
        <i />
      </div>
      <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 py-12 md:grid-cols-4">
        {promises.map((p) => {
          const Icon = ICONS[p.icon];
          return (
            <li key={p.label} className="flex flex-col items-center text-center">
              <Icon className="size-7 text-brass-400" strokeWidth={1} />
              <p className="mt-4 max-w-[11rem] text-[0.6875rem] leading-relaxed font-medium tracking-[0.22em] text-cream-200 uppercase">
                {p.label}
              </p>
            </li>
          );
        })}
      </ul>
      <div className="divider-diamond mx-auto max-w-5xl">
        <i />
      </div>
    </div>
  );
}
