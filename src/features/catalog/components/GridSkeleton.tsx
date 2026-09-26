/**
 * Loading placeholder for the catalogue grid. Matches the real card's aspect
 * ratio and rhythm so nothing shifts when the products arrive.
 */
export function GridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="container-editorial pb-24 md:pb-32">
      <div className="h-12 border-y border-ivory-300" />
      <div className="mt-10 gap-12 lg:grid lg:grid-cols-[15rem_1fr] xl:gap-16">
        <div className="hidden space-y-8 lg:block" aria-hidden="true">
          {[5, 9, 4, 5].map((rows, i) => (
            <div key={i} className="space-y-2.5">
              <div className="h-2.5 w-20 bg-ivory-300" />
              {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="h-3.5 w-full bg-ivory-200" />
              ))}
            </div>
          ))}
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-5 md:gap-y-14 lg:grid-cols-3">
          {Array.from({ length: count }).map((_, i) => (
            <li key={i} aria-hidden="true">
              <div className="aspect-[3/4] w-full animate-pulse bg-ivory-200" />
              <div className="mt-4 h-4 w-4/5 bg-ivory-200" />
              <div className="mt-2 h-3 w-1/2 bg-ivory-200" />
              <div className="mt-2.5 h-3 w-1/4 bg-ivory-200" />
            </li>
          ))}
        </ul>
      </div>
      <span className="sr-only" role="status">
        Loading sarees
      </span>
    </div>
  );
}
